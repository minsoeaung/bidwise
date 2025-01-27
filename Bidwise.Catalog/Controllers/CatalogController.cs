using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json.Serialization;

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
        return Ok(User.Claims.Select(c => new { c.Type, c.Value }));
    }
}
