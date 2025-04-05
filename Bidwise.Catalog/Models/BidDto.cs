using Bidwise.Common.Models.Kafka;

namespace Bidwise.Catalog.Models;

public class BidDto : BidModel
{
    public ItemDto Item { get; set; }
}
