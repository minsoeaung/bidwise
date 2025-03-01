namespace Bidwise.Common.Models.Spring;

public class BidModel
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public int BidderId { get; set; }
    public string BidderName { get; set; }
    public double Amount { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
