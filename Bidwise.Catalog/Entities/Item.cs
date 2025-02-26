
namespace Bidwise.Catalog.Entities;

public class Item
{
    public int Id { get; set; }

    public string Name { get; set; }
    public string Description { get; set; }
    public bool Vickrey { get; set; }

    public string DoubleMetaphone { get; set; }

    public int SellerId { get; set; }
    public string SellerName { get; set; }

    // DENORMALIZED

    // Update through Hangfire at EndDate
    // Actually, should be called WinnerId...
    public int? BuyerId { get; set; }
    public string? BuyerName { get; set; }
    public double? BuyerPayAmount { get; set; }

    public int? CategoryId { get; set; }
    public Category? Category { get; set; }

    public double StartingBid { get; set; }

    // Update through Kafka
    public double? CurrentHighestBid { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public IEnumerable<Image> Images { get; set; } = [];
}
