using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

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
        policy.RequireClaim("scope", "catalog-service"); // which can access this scope
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// ---------------------------------------------------------
app.MapGet("identity", (ClaimsPrincipal user) =>
{
    return user.Claims.Select(c => new { c.Type, c.Value });
}).RequireAuthorization();

app.MapGet("/", () => "Hello World!");
// ---------------------------------------------------------

app.MapControllers();

app.Run();
