using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bidwise.Bids.controllers;

[ApiController]
[Route("api/bids")]
[Authorize]
public class BidsController : ControllerBase
{

    [HttpGet]
    [AllowAnonymous]
    public string Get()
    {
        return "This message come from public API endpoint of bids service";
    }

    [HttpGet("private")]
    public IActionResult GetPrivate()
    {
        return Ok(User.Claims.Select(c => new { c.Type, c.Value }));
    }
}
