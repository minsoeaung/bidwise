using IdentityModel;
using System.Security.Claims;

namespace Bidwise.Catalog.Extensions;

public static class HttpContextExt
{
    public static int GetUserId(this ClaimsPrincipal value)
    {
        return int.Parse(value.FindFirstValue(JwtClaimTypes.Subject));
    }

    public static string GetUserName(this ClaimsPrincipal value)
    {
        return "wait";
        //return int.Parse(value.FindFirstValue(JwtClaimTypes));
    }
}
