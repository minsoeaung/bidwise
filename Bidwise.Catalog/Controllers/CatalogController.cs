using Bidwise.Catalog.Data;
using Bidwise.Catalog.Entities;
using Bidwise.Catalog.Extensions;
using Bidwise.Catalog.Models;
using Bidwise.Catalog.Services.Interfaces;
using Bidwise.Common;
using Bidwise.Common.Models;
using Bidwise.Common.Models.Spring;
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
            StartDate = DateTimeOffset.UtcNow,
            EndDate = dto.EndDate,
            StartingBid = dto.StartingBid,
            Vickrey = dto.Vickrey,

            Category = dto.CategoryName == null ? null : category,
            Images = images
        };

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
            Value = JsonSerializer.Serialize(item)
        });
    }
}
