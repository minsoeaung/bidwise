namespace Bidwise.Identity.Models;

public class BidModel
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public int BidderId { get; set; }
    public string BidderName { get; set; }
    public double Amount { get; set; }
}
