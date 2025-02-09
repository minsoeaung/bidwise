using Bidwise.Catalog.Data;
using Bidwise.Catalog.Entities;
using Bidwise.Catalog.Extensions;
using Bidwise.Catalog.Models;
using Bidwise.Catalog.Services.Interfaces;
using Bidwise.Common;
using Bidwise.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = User.GetProfile();
        if (user == null)
            return Unauthorized();

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

        IList<Image> images = [];

        var imageUploadTasks = dto.Images.Select(async image =>
        {
            var imageName = Guid.NewGuid().ToString();
            await _fileService.UploadFileAsync(image, imageName);
            images.Add(new Image { Name = imageName });
        });

        IList<string> metaphoneKeys = [];
        var metaphone = new DoubleMetaphone();
        foreach (var word in dto.Name.Split(" "))
        {
            metaphone.computeKeys(word);
            if (!string.IsNullOrEmpty(metaphone.PrimaryKey))
                metaphoneKeys.Add(metaphone.PrimaryKey);
            if (!string.IsNullOrEmpty(metaphone.AlternateKey))
                metaphoneKeys.Add(metaphone.AlternateKey);
        }

        var item = new Item
        {
            Name = dto.Name,
            Description = dto.Description,
            SellerId = (int)user.Id,
            SellerName = user.UserName ?? string.Empty,
            DoubleMetaphone = string.Join(',', metaphoneKeys),
            StartDate = DateTime.UtcNow,
            EndDate = dto.EndDate,
            StartingBid = dto.StartingBid,

            Category = dto.CategoryName == null ? null : category,
            Images = images
        };

        _context.Items.Add(item);
        _context.SaveChanges();

        await Task.WhenAll(imageUploadTasks);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return CreatedAtAction(nameof(GetOne), new { id = item.Id }, item);
    }
}
