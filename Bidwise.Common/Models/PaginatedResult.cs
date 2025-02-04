namespace Bidwise.Common.Models;

public class PaginatedResult<T, OrderByOptions, FilterByOptions>
{
    public PaginatedResult(IEnumerable<T> list, PageOptions<OrderByOptions, FilterByOptions> sortFilterPageData)
    {
        Paging = sortFilterPageData;
        Data = list;
    }

    public IEnumerable<T> Data { get; private set; }

    public PageOptions<OrderByOptions, FilterByOptions> Paging { get; private set; }
}
