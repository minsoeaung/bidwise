using Amazon.S3;
using Bidwise.Catalog.Data;
using Bidwise.Catalog.Kafka;
using Bidwise.Catalog.Services;
using Bidwise.Catalog.Services.Interfaces;
using Confluent.Kafka;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddDbContext<CatalogDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.Authority = builder.Configuration["IDENTITY_ENDPOINT"];
    options.TokenValidationParameters.ValidateAudience = false;
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ApiScope", policy =>
    {
        policy.RequireAuthenticatedUser(); // valid access token
        policy.RequireClaim("scope", "catalog"); // which can access this scope
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();
builder.Services.AddScoped<IFileService, FileService>();

builder.AddKafkaProducer<string, string>("kafka");

builder.AddKafkaConsumer<string, string>("kafka", options =>
{
    options.Config.GroupId = "catalog-group";
    options.Config.AutoOffsetReset = AutoOffsetReset.Earliest;
    options.Config.EnableAutoCommit = false;
});

builder.Services.AddHostedService<KafkaConsumer>();

builder.Services.AddHangfire(configuration => configuration
      .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
      .UseSimpleAssemblyNameTypeSerializer()
      .UseRecommendedSerializerSettings()
      .UseSqlServerStorage(builder.Configuration.GetConnectionString("HangfireConnection")));

builder.Services.AddHangfireServer();

builder.Services.AddHttpClient("BidsService", httpClient =>
{
    httpClient.BaseAddress = new Uri("http://localhost:5004");
});

var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseHangfireDashboard();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers()
    .RequireAuthorization("ApiScope");

using var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();

var dbContext = serviceScope.ServiceProvider.GetRequiredService<CatalogDbContext>();

if (dbContext.Database.GetPendingMigrations().Any())
    dbContext.Database.Migrate();

app.Run();
