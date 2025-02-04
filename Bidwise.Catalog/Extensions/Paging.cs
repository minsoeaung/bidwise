using Bidwise.Catalog.Entities;
using Bidwise.Catalog.Models;

namespace Bidwise.Catalog.Extensions;

public static class Paging
{
    public static IQueryable<Item> OrderItemsBy(this IQueryable<Item> items, ItemsOrderBy orderByOptions)
    {
        return orderByOptions switch
        {
            ItemsOrderBy.SimpleOrder => items.OrderByDescending(i => i.Id),
            ItemsOrderBy.Name => items.OrderByDescending(i => i.Name),
            ItemsOrderBy.EndingSoon => items.OrderByDescending(i => i.EndDate),
            ItemsOrderBy.NewlyListed => items.OrderByDescending(i => i.Id),
            _ => throw new ArgumentOutOfRangeException(nameof(orderByOptions), orderByOptions, null),
        };
    }

    public static IQueryable<Item> FilterItemsBy(this IQueryable<Item> items, ItemsFilterBy filterBy, string? filterValue)
    {
        if (string.IsNullOrEmpty(filterValue))
            return items;

        switch (filterBy)
        {
            case ItemsFilterBy.NoFilter:
                return items;
            case ItemsFilterBy.ByStatus:
                ItemsStatus filterStatus;

                if (Enum.TryParse(filterValue, out filterStatus))
                {
                    return filterStatus switch
                    {
                        ItemsStatus.Available => items.Where(i => i.BuyerId == null && i.EndDate > DateTime.UtcNow),
                        ItemsStatus.Expired => items.Where(i => i.BuyerId == null && i.EndDate <= DateTime.UtcNow),
                        ItemsStatus.Sold => items.Where(i => i.BuyerId != null),
                        _ => items,
                    };
                }

                return items;
            case ItemsFilterBy.ByName:

                IEnumerable<string> keys = [];
                var metaphone = new DoubleMetaphone();

                foreach (var word in filterValue.Split(" "))
                {
                    metaphone.computeKeys(word);
                    if (!string.IsNullOrEmpty(metaphone.PrimaryKey))
                        keys.Append(metaphone.PrimaryKey);
                    if (!string.IsNullOrEmpty(metaphone.AlternateKey))
                        keys.Append(metaphone.AlternateKey);
                }

                return items
                    .Where(i => i.Name.ToLower().Contains(filterValue.ToLower()) || keys.Any(m => i.DoubleMetaphone.Contains(m)));
            default:
                throw new ArgumentOutOfRangeException(nameof(filterBy), filterBy, null);
        }
    }
}
