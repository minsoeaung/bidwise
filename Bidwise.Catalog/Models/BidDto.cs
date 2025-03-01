using Bidwise.Common.Models.Spring;

namespace Bidwise.Catalog.Models;

public class BidDto : BidModel
{
    public ItemDto Item { get; set; }
}
