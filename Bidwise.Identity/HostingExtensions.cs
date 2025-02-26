using Bidwise.Identity.Data;
using Bidwise.Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Security.Claims;
using System.Reflection;
using Duende.IdentityModel;
using Duende.IdentityServer.EntityFramework.DbContexts;
using Duende.IdentityServer.EntityFramework.Mappers;
using Duende.IdentityServer;
using Microsoft.AspNetCore.Authentication.OAuth;
using Confluent.Kafka;
using Bidwise.Identity.Kafka;

namespace Bidwise.Identity;

internal static class HostingExtensions
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddRazorPages();

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("ConnectionString for Identity Service not found.");
        var migrationsAssembly = typeof(Program).GetTypeInfo().Assembly.GetName().Name;

        builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

        builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
        {
            options.SignIn.RequireConfirmedAccount = false;
            options.SignIn.RequireConfirmedEmail = false;

            // haha
            options.User.AllowedUserNameCharacters = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ ";
        })
            .AddDefaultUI()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        builder.Services
            .AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;

                // see https://docs.duendesoftware.com/identityserver/v6/fundamentals/resources/
                options.EmitStaticAudienceClaim = true;
            })
            .AddAspNetIdentity<ApplicationUser>()

            // Clients, ApiScopes, ApiResources, IdentityResources, bla bla
            .AddConfigurationStore(options =>
            {
                options.DefaultSchema = "idsvr";
                options.ConfigureDbContext = b => b.UseSqlServer(connectionString, sql => sql.MigrationsAssembly(migrationsAssembly));
            })
            .AddConfigurationStoreCache()
            .AddOperationalStore(options =>
            {
                options.DefaultSchema = "idsvr";
                options.ConfigureDbContext = b => b.UseSqlServer(connectionString, sql => sql.MigrationsAssembly(migrationsAssembly));
                options.EnableTokenCleanup = true;
            })
            //.AddInMemoryApiResources(Config.ApiResources)
            //.AddInMemoryIdentityResources(Config.IdentityResources)
            //.AddInMemoryApiScopes(Config.ApiScopes)
            //.AddInMemoryClients(Config.Clients)
            .AddDeveloperSigningCredential()
            .AddProfileService<CustomProfileService>();

        var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
        var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

        if (googleClientId != null && googleClientSecret != null)
        {
            builder.Services.AddAuthentication()
           .AddGoogle(options =>
           {
               // If this is enabled and use default identity pages, "Error loading external login information."
               // options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;

               // set the redirect URI to builder.Configuration["IDENTITY_ENDPOINT"]/signin-google in Google console
               options.ClientId = googleClientId;
               options.ClientSecret = googleClientSecret;
           });
        }

        builder.AddKafkaConsumer<string, string>("kafka", options =>
        {
            options.Config.GroupId = "identity-group";
            options.Config.AutoOffsetReset = AutoOffsetReset.Earliest;
            options.Config.EnableAutoCommit = false;
        });

        builder.Services.AddHostedService<KafkaConsumer>();

        return builder.Build();
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        app.UseSerilogRequestLogging();

        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseStaticFiles();
        app.UseRouting();
        app.UseIdentityServer();
        app.UseAuthorization();

        app.MapRazorPages()
            .RequireAuthorization();

        return app;
    }

    public static WebApplication InitializeDatabase(this WebApplication app)
    {
        using var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();

        var applicationDbContext = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var persistedDbContext = serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>();
        var configurationDbContext = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
        var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        if (applicationDbContext.Database.GetPendingMigrations().Any())
            applicationDbContext.Database.Migrate();

        if (persistedDbContext.Database.GetPendingMigrations().Any())
            persistedDbContext.Database.Migrate();

        if (configurationDbContext.Database.GetPendingMigrations().Any())
            configurationDbContext.Database.Migrate();

        foreach (var client in Config.Clients)
        {
            if (!configurationDbContext.Clients.Any(x => x.ClientId == client.ClientId))
            {
                configurationDbContext.Clients.Add(client.ToEntity());
            }
        }

        foreach (var apiScope in Config.ApiScopes)
        {
            if (!configurationDbContext.ApiScopes.Any(x => x.Name == apiScope.Name))
            {
                configurationDbContext.ApiScopes.Add(apiScope.ToEntity());
            }
        }

        foreach (var identityResource in Config.IdentityResources)
        {
            if (!configurationDbContext.IdentityResources.Any(x => x.Name == identityResource.Name))
            {
                identityResource.Description = identityResource.Description ?? string.Empty;
                configurationDbContext.IdentityResources.Add(identityResource.ToEntity());
            }
        }

        foreach (var apiResource in Config.ApiResources)
        {
            if (!configurationDbContext.ApiResources.Any(x => x.Name == apiResource.Name))
            {
                apiResource.Description = apiResource.Description ?? string.Empty;
                configurationDbContext.ApiResources.Add(apiResource.ToEntity());
            }
        }

        var alice = userManager.FindByNameAsync("alice").Result;
        if (alice == null)
        {
            alice = new ApplicationUser
            {
                UserName = "alice",
                Email = "AliceSmith@email.com",
                EmailConfirmed = true,
            };
            var result = userManager.CreateAsync(alice, "Pass123$").Result;
            if (!result.Succeeded)
            {
                throw new Exception(result.Errors.First().Description);
            }

            result = userManager.AddClaimsAsync(alice, new Claim[]{
                            new Claim(JwtClaimTypes.Name, "Alice Smith"),
                            new Claim(JwtClaimTypes.GivenName, "Alice"),
                            new Claim(JwtClaimTypes.FamilyName, "Smith"),
                            new Claim(JwtClaimTypes.WebSite, "http://alice.com"),
                        }).Result;
            if (!result.Succeeded)
            {
                throw new Exception(result.Errors.First().Description);
            }
            Log.Debug("Alice created");
        }
        else
        {
            Log.Debug("Alice is there");
        }

        configurationDbContext.SaveChanges();

        return app;
    }
}