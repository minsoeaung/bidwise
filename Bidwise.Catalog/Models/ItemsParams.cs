namespace Bidwise.Catalog.Models;

public class ItemsParams
{
    public ItemsOrderBy? OrderBy { get; set; }
    public string? SearchTerm { get; set; }
    public ItemsStatus? Status { get; set; }
    public ItemsType? Type { get; set; }
    public string? Categories { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 25;
}
