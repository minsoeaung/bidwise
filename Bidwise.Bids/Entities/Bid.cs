namespace Bidwise.Bids.Entities;

public class Bid
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public int BidderId { get; set; }
    public string BidderName { get; set; }

    public double Amount { get; set; }
    public DateTime BidTime { get; set; }
}
