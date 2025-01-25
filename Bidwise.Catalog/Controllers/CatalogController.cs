using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bidwise.Catalog.Controllers;

[ApiController]
[Route("api/catalog")]
[Authorize]
public class CatalogController : ControllerBase
{
    private readonly ILogger<CatalogController> _logger;

    public CatalogController(ILogger<CatalogController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    [AllowAnonymous]
    public string Get()
    {
        return "This message come from public API endpoint of catalog service";
    }

    [HttpGet("private")]
    public IActionResult GetPrivate()
    {
        var userId = User.FindFirst("sub")?.Value;

        return Ok(new { Message = "Hello, Secure World!", UserId = userId });
    }
}
