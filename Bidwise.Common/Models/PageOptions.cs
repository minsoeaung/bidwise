namespace Bidwise.Common.Models;

public class PageOptions<OrderByOptions, FilterByOptions>
{
    public const int DefaultPageSize = 20;

    private int _pageNum = 1;

    private int _pageSize = DefaultPageSize;

    public int[] PageSizes = [5, DefaultPageSize, 20, 50, 100, 500, 1000];

    public OrderByOptions OrderBy { get; set; }

    public FilterByOptions FilterBy { get; set; }

    public string? FilterValue { get; set; }

    public int PageNum
    {
        get { return _pageNum; }
        set { _pageNum = value; }
    }

    public int PageSize
    {
        get { return _pageSize; }
        set { _pageSize = value; }
    }

    public int NumPages { get; private set; }

    public void SetupRestOfDto<T>(IQueryable<T> query)
    {
        NumPages = (int)Math.Ceiling((double)query.Count() / PageSize);
        PageNum = Math.Min(
            Math.Max(1, PageNum), NumPages);
    }
}
