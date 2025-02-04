using Bidwise.Common.Models;
using IdentityModel;
using System.Security.Claims;

namespace Bidwise.Common;

public static class ClaimsPrincipalExtensions
{
    public static int? GetId(this ClaimsPrincipal user)
    {
        // can use "user_id" because that's what we set in the CustomProfileService
        // kindy hacky, but it works
        if (int.TryParse(user.FindFirst("user_id")?.Value, out int userId))
        {
            return userId;
        }

        return null;
    }

    public static UserProfile? GetProfile(this ClaimsPrincipal user)
    {
        var userId = user.GetId();

        if (userId == null)
            return null;

        return new UserProfile
        {
            Id = (int)userId,
            UserName = user.FindFirstValue("username"),
            Email = user.FindFirstValue("email")
        };
    }
}
