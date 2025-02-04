using Amazon.S3;
using Bidwise.Catalog.Data;
using Bidwise.Catalog.Services;
using Bidwise.Catalog.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddDbContext<CatalogDbContext>(options => options.UseSqlServer(builder.Configuration["ConnectionStrings:DefaultConnection"]));

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

var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

using var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();

var dbContext = serviceScope.ServiceProvider.GetRequiredService<CatalogDbContext>();

if (dbContext.Database.GetPendingMigrations().Any())
    dbContext.Database.Migrate();

app.Run();
