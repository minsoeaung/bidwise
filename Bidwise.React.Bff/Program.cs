using Duende.Bff.Yarp;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddBff()
    .AddRemoteApis();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = "cookie";
    options.DefaultChallengeScheme = "oidc";
    options.DefaultSignOutScheme = "oidc";
}).AddCookie("cookie", options =>
{
    options.Cookie.Name = "__Host-bff";
    options.Cookie.SameSite = SameSiteMode.Strict;
}).AddOpenIdConnect("oidc", options =>
{
    options.Authority = builder.Configuration["IDENTITY_ENDPOINT"];
    options.ClientId = "web-spa";
    options.ClientSecret = "secret";
    options.ResponseType = "code";
    options.ResponseMode = "query";

    options.GetClaimsFromUserInfoEndpoint = true;
    options.MapInboundClaims = false;
    options.SaveTokens = true;
    options.DisableTelemetry = true;

    options.Scope.Clear();
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("catalog");
    options.Scope.Add("comments");
    options.Scope.Add("bids");
    options.Scope.Add("offline_access");

    options.TokenValidationParameters = new()
    {
        NameClaimType = "name",
        RoleClaimType = "role"
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseBff();
app.UseAuthorization();
app.MapBffManagementEndpoints();

app.MapRemoteBffApiEndpoint("/api", $"{builder.Configuration["API_GATEWAY_ENDPOINT"]}/api")
    .WithOptionalUserAccessToken();

app.MapFallbackToFile("/index.html");

app.Run();