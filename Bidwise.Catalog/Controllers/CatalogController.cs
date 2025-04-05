using Bidwise.Catalog.Data;
using Bidwise.Catalog.Entities;
using Bidwise.Catalog.Extensions;
using Bidwise.Catalog.Models;
using Bidwise.Catalog.Services.Interfaces;
using Bidwise.Common;
using Bidwise.Common.Models;
using Bidwise.Common.Models.Kafka;
using Confluent.Kafka;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Bidwise.Catalog.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CatalogController : ControllerBase
{
    private readonly CatalogDbContext _context;
    private readonly IFileService _fileService;
    private readonly IProducer<string, string> _kafkaProducer;
    private readonly IHttpClientFactory _httpClientFactory;

    public CatalogController(CatalogDbContext context, IFileService fileService, IProducer<string, string> producer, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _fileService = fileService;
        _kafkaProducer = producer;
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("buy")]
    public async Task<ActionResult<IEnumerable<BidDto>>> GetAllAsync()
    {
        var user = User.GetProfile();
        if (user == null)
            return Unauthorized();

        var httpClient = _httpClientFactory.CreateClient("BidsService");
        var httpResponseMessage = await httpClient.GetAsync($"api/bids?bidderId={user.Id}");

        if (!httpResponseMessage.IsSuccessStatusCode)
            throw new HttpRequestException($"Failed to retrieve bids. Status code: {httpResponseMessage.StatusCode}");

        using var contentStream = await httpResponseMessage.Content.ReadAsStreamAsync();
        var bids = await JsonSerializer.DeserializeAsync<IList<BidModel>>(contentStream, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (bids == null)
            throw new HttpRequestException($"Failed to parse bids.");

        if (bids.Count == 0)
            return new List<BidDto>();

        var itemIds = bids.Select(b => b.ItemId);

        var itemsQuery = _context.Items
            .AsNoTracking()
            .OrderItemsBy(ItemsOrderBy.SimpleOrder)
            .Where(i => itemIds.Contains(i.Id))
            .MapItemsToDto();

        var items = await itemsQuery.ToListAsync();

        return Ok(bids.Select(b => new BidDto
        {
            Id = b.Id,
            BidderId = b.BidderId,
            BidderName = b.BidderName,
            Amount = b.Amount,
            ItemId = b.ItemId,
            CreatedAt = b.CreatedAt,
            UpdatedAt = b.UpdatedAt,
            Item = items.FirstOrDefault(i => i.Id == b.ItemId)
                ?? throw new InvalidOperationException($"Item with Id {b.ItemId} not found for Bid with Id {b.Id}.")
        }));
    }

    [HttpGet("sell")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ItemDto>>> GetSellingItemsAsync(int userId)
    {
        var itemsQuery = _context.Items
            .AsNoTracking()
            .OrderItemsBy(ItemsOrderBy.SimpleOrder)
            .Where(i => i.SellerId == userId)
            .MapItemsToDto();

        return await itemsQuery.ToListAsync();
    }

    [HttpGet]
    [AllowAnonymous]
    public ActionResult<PagedResult<ItemDto>> GetAll([FromQuery] ItemsParams itemParams)
    {
        var itemsQuery = _context.Items
            .AsNoTracking()
            .OrderItemsBy(itemParams.OrderBy)
            .FilterItemsByName(itemParams.SearchTerm)
            .FilterItemsByStatus(itemParams.Status)
            .FilterItemsByCategories(itemParams.Categories)
            .FilterItemsByType(itemParams.Type)
            .MapItemsToDto();

        var items = PagedList<ItemDto>.ToPagedList(itemsQuery, itemParams.PageNumber, itemParams.PageSize);

        return new PagedResult<ItemDto>
        {
            Content = items,
            Pageable = items.Pageable,
            Size = items.Size,
            TotalPages = items.TotalPages
        };
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

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Item>> UpdateAsync(int id, [FromForm] ItemUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = User.GetProfile();
        if (user == null)
            return Unauthorized();

        var item = await _context.Items
            .Include(i => i.Category)
            .Include(i => i.Images)
            .Include(i => i.Attributes)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (item == null)
            return NotFound();

        using var transaction = await _context.Database.BeginTransactionAsync();


        if (dto.CategoryName != null)
        {
            var categoryChanged = dto.CategoryName != item.Category?.Name;
            if (categoryChanged)
            {
                var category = new Category();
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

                // Category
                item.Category = category;
                item.CategoryId = category.Id;
            }
        }
        else
        {
            // Category
            item.CategoryId = null;
        }

        var nameChanged = dto.Name != item.Name;
        if (nameChanged)
        {
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

            // Name
            item.Name = dto.Name;
            item.DoubleMetaphone = string.Join(',', metaphoneKeys);
        }




        _context.Images.RemoveRange(item.Images);
        // item.Images is null because of missing .Include
        var removeImageTasks = item.Images.Select(async image =>
        {
            await _fileService.DeleteFileAsync(image.Name);
        });
        await Task.WhenAll(removeImageTasks);
        if (dto.Images.Any())
        {
            IList<Image> images = [];
            var imageUploadTasks = dto.Images.Select(async image =>
            {
                var imageName = Guid.NewGuid().ToString();
                await _fileService.UploadFileAsync(image, imageName);
                images.Add(new Image { Name = imageName });
            });
            await Task.WhenAll(imageUploadTasks);
            item.Images = images;
        }



        _context.Attributes.RemoveRange(item.Attributes);
        if (!string.IsNullOrEmpty(dto.Attributes))
        {
            var attributes = JsonSerializer.Deserialize<IList<AttributeCreateDto>>(dto.Attributes, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (attributes != null && attributes.Count > 0)
            {
                item.Attributes = attributes.Select(a => new Entities.Attribute
                {
                    Label = a.Label,
                    Value = a.Value
                }).ToList();
            }
        }

        item.Description = dto.Description;
        item.Note = dto.Note;

        _context.Items.Update(item);

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return item;
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
            Note = dto.Note,
            SellerId = (int)user.Id,
            SellerName = user.UserName ?? string.Empty,
            DoubleMetaphone = string.Join(',', metaphoneKeys),
            StartDate = DateTimeOffset.UtcNow,
            EndDate = dto.EndDate,
            StartingBid = dto.StartingBid,
            Vickrey = dto.Vickrey,

            Category = dto.CategoryName == null ? null : category,
            Images = images,
        };

        if (!string.IsNullOrEmpty(dto.Attributes))
        {
            var attributes = JsonSerializer.Deserialize<IList<AttributeCreateDto>>(dto.Attributes, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (attributes != null && attributes.Count > 0)
            {
                item.Attributes = attributes.Select(a => new Entities.Attribute
                {
                    Label = a.Label,
                    Value = a.Value

                }).ToList();
            }
        }

        _context.Items.Add(item);
        _context.SaveChanges();

        await Task.WhenAll(imageUploadTasks);
        await _context.SaveChangesAsync();

        // Let the other services know about the new Auction item
        await _kafkaProducer.ProduceAsync(Topics.AuctionCreated, new Message<string, string>
        {
            Key = item.Id.ToString(),
            Value = JsonSerializer.Serialize(item)
        });

        // Determine the winner at EndDate
        BackgroundJob.Schedule(() => DetermineWinner(item.Id), item.EndDate - DateTime.UtcNow);

        await transaction.CommitAsync();

        return CreatedAtAction(nameof(GetOne), new { id = item.Id }, item);
    }

    public async Task DetermineWinner(int itemId)
    {
        var item = await _context.Items.FindAsync(itemId);
        if (item == null)
            throw new ArgumentException($"Item with ID {itemId} not found.");

        // for Idempotency purpose
        // Winner already determined, no further action needed
        if (item.BuyerId.HasValue)
            return;

        // Here, we get the top 2 bids from the Bids service
        var httpClient = _httpClientFactory.CreateClient("BidsService");
        var httpResponseMessage = await httpClient.GetAsync($"api/bids/top-2?itemId={itemId}");

        if (!httpResponseMessage.IsSuccessStatusCode)
            throw new HttpRequestException($"Failed to retrieve bids. Status code: {httpResponseMessage.StatusCode}");

        using var contentStream = await httpResponseMessage.Content.ReadAsStreamAsync();
        var bids = await JsonSerializer.DeserializeAsync<IList<BidModel>>(contentStream, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (bids == null || bids.Count == 0)
        {
            await _kafkaProducer.ProduceAsync(Topics.AuctionEnded, new Message<string, string>
            {
                Key = item.Id.ToString(),
                Value = JsonSerializer.Serialize(new ItemModel
                {
                    Id = item.Id,
                    SellerId = item.SellerId,
                    BuyerId = null,
                    BuyerPayAmount = null
                })
            });

            // No winner to determine
            return;
        }


        var highestBid = bids[0];
        var secondHighestBid = bids.Count > 1 ? bids[1] : null;

        item.BuyerId = highestBid.BidderId;
        item.BuyerName = highestBid.BidderName;
        if (item.Vickrey)
        {
            item.BuyerPayAmount = secondHighestBid?.Amount ?? highestBid.Amount;
        }
        else
        {
            item.BuyerPayAmount = highestBid.Amount;
        }


        _context.Items.Update(item);
        await _context.SaveChangesAsync();

        await _kafkaProducer.ProduceAsync(Topics.AuctionEnded, new Message<string, string>
        {   
            Key = item.Id.ToString(),
            Value = JsonSerializer.Serialize(new ItemModel
            {
                Id = item.Id,
                SellerId = item.SellerId,
                BuyerId = item.BuyerId,
                BuyerPayAmount = item.BuyerPayAmount
            })
        });
    }
}
