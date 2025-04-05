namespace Bidwise.Common.Models.Kafka;

public class ItemModel
{
    public int Id { get; set; }
    public int SellerId { get; set; }
    public int? BuyerId { get; set; }
    public double? BuyerPayAmount { get; set; }
}