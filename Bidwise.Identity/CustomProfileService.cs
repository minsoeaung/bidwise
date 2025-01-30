using Bidwise.Identity.Models;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
namespace Bidwise.Identity;

// a custom profile service to control what claims are issued from IdentityServer
public class CustomProfileService : IProfileService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public CustomProfileService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var user = await _userManager.GetUserAsync(context.Subject);

        if (user != null)
        {
            var claims = new List<Claim>
            {
                new Claim("user_id", user.Id.ToString()),
                new Claim("username", user.UserName ?? string.Empty),
                new Claim("email", user.Email ?? string.Empty),
                new Claim("hello", "world")
            };

            context.IssuedClaims.AddRange(claims);
        }

    }

    public async Task IsActiveAsync(IsActiveContext context)
    {
        var user = await _userManager.GetUserAsync(context.Subject);
        context.IsActive = user != null;
    }
}
