using Bidwise.Catalog.Entities;
using Bidwise.Catalog.Models;

namespace Bidwise.Catalog.Extensions;

public static class Paging
{
    public static IQueryable<Item> OrderItemsBy(this IQueryable<Item> items, ItemsOrderBy? orderByOptions)
    {
        if (orderByOptions == null)
            return items.OrderByDescending(i => i.Id);

        return orderByOptions switch
        {
            ItemsOrderBy.SimpleOrder => items.OrderByDescending(i => i.Id),
            ItemsOrderBy.Name => items.OrderBy(i => i.Name),
            ItemsOrderBy.EndingSoon => items.OrderBy(i => i.EndDate),
            ItemsOrderBy.NewlyListed => items.OrderByDescending(i => i.Id),
            _ => throw new ArgumentOutOfRangeException(nameof(orderByOptions), orderByOptions, null),
        };
    }

    public static IQueryable<Item> FilterItemsByName(this IQueryable<Item> items, string? searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
            return items;

        IList<string> metaphoneKeys = [];
        var metaphone = new DoubleMetaphone();

        foreach (var word in searchTerm.Split(" "))
        {
            metaphone.computeKeys(word);

            if (!string.IsNullOrEmpty(metaphone.PrimaryKey))
                metaphoneKeys.Add(metaphone.PrimaryKey);
            if (!string.IsNullOrEmpty(metaphone.AlternateKey))
                metaphoneKeys.Add(metaphone.AlternateKey);
        }

        return items
            .Where(i => i.Name.ToLower().Contains(searchTerm.ToLower()) // Spelling check
            || metaphoneKeys.Any(m => i.DoubleMetaphone.Contains(m))); // Phonetic check
    }

    public static IQueryable<Item> FilterItemsByStatus(this IQueryable<Item> items, ItemsStatus? statusOptions)
    {
        if (statusOptions == null)
            return items.Where(i => i.BuyerId == null && i.EndDate > DateTimeOffset.UtcNow);

        return statusOptions switch
        {
            ItemsStatus.All => items,
            ItemsStatus.Available => items.Where(i => i.BuyerId == null && i.EndDate > DateTimeOffset.UtcNow),
            ItemsStatus.Expired => items.Where(i => i.BuyerId == null && i.EndDate <= DateTimeOffset.UtcNow),
            ItemsStatus.Sold => items.Where(i => i.BuyerId != null),
            ItemsStatus.Ended => items.Where(i => i.EndDate <= DateTimeOffset.UtcNow),
            _ => throw new ArgumentOutOfRangeException(nameof(statusOptions), statusOptions, null),
        };
    }

    public static IQueryable<Item> FilterItemsByType(this IQueryable<Item> items, ItemsType? itemType)
    {
        if (itemType == null)
            return items;

        return itemType switch
        {
            ItemsType.All => items,
            ItemsType.Vickrey => items.Where(i => i.Vickrey),
            ItemsType.Normal => items.Where(i => !i.Vickrey),
            _ => throw new ArgumentOutOfRangeException(nameof(itemType), itemType, null),
        };
    }

    public static IQueryable<Item> FilterItemsByCategories(this IQueryable<Item> items, string? commaSeparatedCategories)
    {
        if (string.IsNullOrEmpty(commaSeparatedCategories))
            return items;

        var categoryList = new List<string>();

        categoryList.AddRange(commaSeparatedCategories.Trim().ToLower().Split(",").ToList());

        items = items.Where(i => i.CategoryId != null && (categoryList.Count == 0 || categoryList.Contains(i.Category!.Name.ToLower())));

        return items;
    }
}
