using Bidwise.Catalog.Entities;
using Bidwise.Catalog.Models;

namespace Bidwise.Catalog.Extensions;

public static class Mapping
{
    public static IQueryable<ItemDto> MapItemsToDto(this IQueryable<Item> items)
    {
        return items.Select(i => new ItemDto
        {
            Id = i.Id,
            Name = i.Name,
            StartDate = i.StartDate,
            EndDate = i.EndDate,
            DoubleMetaphone = i.DoubleMetaphone,
            CurrentHighestBid = i.CurrentHighestBid,
            CurrentHighestBidderId = i.CurrentHighestBidderId,
            Description = i.Description,
            BuyerId = i.BuyerId,
            BuyerName = i.BuyerName,
            SellerId = i.SellerId,
            SellerName = i.SellerName,
            StartingBid = i.StartingBid,
            BuyerPayAmount = i.BuyerPayAmount,
            Vickrey = i.Vickrey,
            CategoryName = i.Category != null ? i.Category.Name : null,
            Images = i.Images.Select(img => new ImageDto
            {
                Name = img.Name,
                Label = img.Label
            })  
        });
    }
}
