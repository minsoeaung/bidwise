using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = "Cookies";
    options.DefaultChallengeScheme = "oidc";
})
    .AddCookie("Cookies", options =>
    {
        options.Cookie.Name = "web";

        // automatically revoke refresh token at signout time
        options.Events.OnSigningOut = async e =>
        {
            await e.HttpContext.RevokeRefreshTokenAsync();
        };
    })
    .AddOpenIdConnect("oidc", options =>
    {
        options.Authority = builder.Configuration["IDENTITY_ENDPOINT"];

        options.ClientId = "web-mvc";
        options.ClientSecret = "secret";

        options.ResponseType = "code";
        options.ResponseMode = "query";

        options.Scope.Clear();

        // OIDC related scopes
        options.Scope.Add("openid");
        options.Scope.Add("profile");

        // API scopes
        options.Scope.Add("catalog");
        options.Scope.Add("comments");
        options.Scope.Add("bids");

        // requests a refresh token
        options.Scope.Add("offline_access");

        options.GetClaimsFromUserInfoEndpoint = true;
        options.MapInboundClaims = false;

        // important! this store the access and refresh token in the authentication session
        // this is needed to the standard token store to manage the artefacts
        options.SaveTokens = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            NameClaimType = "name",
            RoleClaimType = "role"
        };
    });

builder.Services.AddOpenIdConnectAccessTokenManagement();

builder.Services.AddUserAccessTokenHttpClient("apiClient",
    configureClient: client =>
    {
        client.BaseAddress = new Uri($"{builder.Configuration["API_GATEWAY_ENDPOINT"]}/api/");
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .RequireAuthorization()
   .WithStaticAssets();

app.Run();
