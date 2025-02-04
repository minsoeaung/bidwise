using Bidwise.Catalog.Entities;
using Bidwise.Catalog.Models;

namespace Bidwise.Catalog.Extensions;

public static class Paging
{
    public static IQueryable<Item> OrderItemsBy(this IQueryable<Item> items, OrderByOptions orderByOptions)
    {
        return orderByOptions switch
        {
            OrderByOptions.SimpleOrder => items.OrderByDescending(i => i.Id),
            OrderByOptions.Name => items.OrderByDescending(i => i.Name),
            OrderByOptions.EndingSoon => items.OrderByDescending(i => i.EndDate),
            OrderByOptions.NewlyListed => items.OrderByDescending(i => i.Id),
            _ => throw new ArgumentOutOfRangeException(nameof(orderByOptions), orderByOptions, null),
        };
    }

    public static IQueryable<T> Page<T>(this IQueryable<T> query, int pageNumZeroStart, int pageSize)
    {
        if (pageSize == 0)
            throw new ArgumentOutOfRangeException(nameof(pageSize), "pageSize cannot be zero.");

        if (pageNumZeroStart != 0)
            query = query.Skip(pageNumZeroStart * pageSize);

        return query.Take(pageSize);
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
                Status filterStatus;

                if (Enum.TryParse(filterValue, out filterStatus))
                {
                    return filterStatus switch
                    {
                        Status.Available => items.Where(i => i.BuyerId == null && i.EndDate > DateTime.UtcNow),
                        Status.Expired => items.Where(i => i.BuyerId == null && i.EndDate <= DateTime.UtcNow),
                        Status.Sold => items.Where(i => i.BuyerId != null),
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
