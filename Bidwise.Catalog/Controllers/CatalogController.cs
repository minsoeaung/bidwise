using Bidwise.Catalog.Data;
using Bidwise.Catalog.Entities;
using Bidwise.Catalog.Extensions;
using Bidwise.Catalog.Models;
using Bidwise.Catalog.Services.Interfaces;
using Bidwise.Common;
using Bidwise.Common.Models;
using IdentityModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Linq;
using System.Security.Claims;

namespace Bidwise.Catalog.Controllers;

[ApiController]
[Route("api/catalog")]
[Authorize]
public class CatalogController : ControllerBase
{
    private readonly ILogger<CatalogController> _logger;
    private readonly CatalogDbContext _context;
    private readonly IFileService _fileService;

    public CatalogController(ILogger<CatalogController> logger, CatalogDbContext context, IFileService fileService)
    {
        _logger = logger;
        _context = context;
        _fileService = fileService;
    }

    [HttpGet]
    public ActionResult<PaginatedResult<ItemDto, ItemsOrderBy, ItemsFilterBy>> GetAll([FromQuery] PageOptions<ItemsOrderBy, ItemsFilterBy> options)
    {

        Console.WriteLine($"--> user id: {User.GetId()}");

        var itemsQuery = _context.Items
            .AsNoTracking()
            .OrderItemsBy(options.OrderBy)
            .FilterItemsBy(options.FilterBy, options.FilterValue)
            .MapItemsToDto();

        itemsQuery = itemsQuery.Page(options.PageNum - 1, options.PageSize);

        options.SetupRestOfDto(itemsQuery);

        return new PaginatedResult<ItemDto, ItemsOrderBy, ItemsFilterBy>(itemsQuery.ToList(), options);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<ItemDto>> GetOne(int id)
    {
        var item = await _context.Items
            .AsNoTracking()
            .MapItemsToDto()
            .FirstOrDefaultAsync(i => i.Id == id);

        return item == null ? NotFound() : item;
    }

    [HttpPost]
    public async Task<ActionResult<Item>> CreateAsync([FromForm] ItemCreateDto dto)
    {
        var userId = User.GetId();
        if (userId == null)
            return Unauthorized();

        var profile = User.GetProfile();
        Console.WriteLine($"--> id {profile.Id}");
        Console.WriteLine($"--> username {profile.UserName}");
        Console.WriteLine($"--> email {profile.Email}");

        return new Item();

        using var transaction = await _context.Database.BeginTransactionAsync();

        var category = new Category();

        if (dto.CategoryName != null)
        {
            var existingCategory = await _context.Categories.FirstOrDefaultAsync(c => c.Name == dto.CategoryName.Trim());
            if (existingCategory == null)
            {
                category.Name = dto.CategoryName.Trim();
                _context.Categories.Add(category);
                _context.SaveChanges();
            }
            else
            {
                category = existingCategory;
            }
        }

        var usernameOrEmail = User.FindFirstValue(JwtClaimTypes.Name)
            ?? User.FindFirstValue(JwtClaimTypes.Email)
            ?? string.Empty;

        var item = new Item
        {
            Name = dto.Name,
            Description = dto.Description,
            SellerId = (int)userId,
            SellerName = User.GetProfile()!.UserName ?? string.Empty,
            CategoryId = category.Id,
            DoubleMetaphone = string.Empty,
            StartDate = DateTime.UtcNow,
            EndDate = dto.EndDate,
            StartingBid = dto.StartingBid,
        };

        _context.Items.Add(item);
        await _context.SaveChangesAsync();

        var imageTasks = dto.Images.Select(async image =>
        {
            var imageName = Guid.NewGuid().ToString();
            await _context.Images.AddAsync(new Entities.Image
            {
                Label = image.Label,
                Name = imageName,
                ItemId = item.Id
            });

            await _fileService.UploadFileAsync(image.File, imageName);
        });

        await Task.WhenAll(imageTasks);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return CreatedAtAction(nameof(GetOne), new { id = item.Id }, item);
    }
}
