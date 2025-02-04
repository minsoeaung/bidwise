namespace Bidwise.Catalog.Models;

public class ItemListDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public double? CurrentHighestBid { get; set; }
    public string DoubleMetaphone { get; set; }
    public int SellerId { get; set; }
    public string SellerName { get; set; }
    public int? BuyerId { get; set; }
    public string? BuyerName { get; set; }
    public Status Status
    {
        get
        {
            if (BuyerId != null)
                return Status.Sold;

            var timeSpan = EndDate.ToUniversalTime() - DateTime.UtcNow;

            if (timeSpan.TotalSeconds <= 0) return Status.Expired;

            return Status.Available;
        }
    }

    public string TimeLeft
    {
        get
        {
            var timeSpan = EndDate.ToUniversalTime() - DateTime.UtcNow;

            if (timeSpan.TotalSeconds <= 0) return Status.Expired.ToString();

            if (timeSpan.TotalDays >= 1)
                return $"{(int)timeSpan.TotalDays} day{(timeSpan.TotalDays >= 2 ? "s" : "")} left";

            if (timeSpan.TotalHours >= 1)
                return $"{(int)timeSpan.TotalHours} hour{(timeSpan.TotalHours >= 2 ? "s" : "")} left";

            return $"{(int)timeSpan.TotalMinutes} minute{(timeSpan.TotalMinutes >= 2 ? "s" : "")} left";
        }
    }
}
