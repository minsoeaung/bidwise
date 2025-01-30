using Duende.IdentityServer;
using Duende.IdentityServer.Models;

namespace Bidwise.Identity;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
        [
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
            new IdentityResources.Email(),
        ];

    public static IEnumerable<ApiResource> ApiResources =>
       [
            new ApiResource("bidwise", "Bidwise API")
            {
                Scopes = { IdentityServerConstants.LocalApi.ScopeName, "catalog", "comments", "bids" } ,
                ApiSecrets = { new Secret("bidwise_secret".Sha256()) }
            }
       ];


    public static IEnumerable<ApiScope> ApiScopes =>
        [
            new ApiScope("catalog"),
            new ApiScope("comments"),
            new ApiScope("bids"),
        ];

    public static IEnumerable<Client> Clients =>
        [
            new Client
            {
                ClientId = "web-mvc",
                ClientSecrets = { new Secret("secret".Sha256()) },
                AllowedGrantTypes = GrantTypes.Code,
                RedirectUris = { "https://localhost:3000/signin-oidc" },
                PostLogoutRedirectUris = { "https://localhost:3000/signout-callback-oidc" },
                AllowOfflineAccess = true,
                AllowedScopes =
                {
                    IdentityServerConstants.LocalApi.ScopeName,
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    "catalog",
                    "comments",
                    "bids"
                }
            },
            new Client
            {
                ClientId = "web-spa",
                ClientSecrets = { new Secret("secret".Sha256()) },
                AllowedGrantTypes = GrantTypes.Code,
                RedirectUris = { "https://localhost:5173/signin-oidc" },
                PostLogoutRedirectUris = { "https://localhost:5173/signout-callback-oidc" },
                AllowOfflineAccess = true,
                AllowedScopes =
                {
                    IdentityServerConstants.LocalApi.ScopeName,
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    "catalog",
                    "comments",
                    "bids"
                }
            },
        ];
}
