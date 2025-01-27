var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Using Reference Token to validate incoming requests

// When introspection is used instead of Jwt, the setup changes
// because the API (protected resource) needs to act as an OAuth Client
// and call the introspection endpoint on the IdentityServer

builder.Services.AddAuthentication("token")
    .AddOAuth2Introspection("token", options =>
    {
        options.Authority = builder.Configuration["IDENTITY_ENDPOINT"];

        // ApiResouce name and secret, not client
        options.ClientId = "bidwise";
        options.ClientSecret = "bidwise_secret";
    });


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ApiScope", policy =>
    {
        policy.RequireAuthenticatedUser(); 
        policy.RequireClaim("scope", "bids");
    });
});

builder.Services.AddControllers();

var app = builder.Build();

app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

