namespace Bidwise.Common.Models;

public class PagedList<T> : List<T>
{
    public Pageable Pageable { get; }
    public int Size { get; private set; }
    public int TotalPages { get; private set; }

    private PagedList(List<T> list, int totalCount, int pageNumber, int pageSize)
    {
        Pageable = new Pageable
        {
            PageNumber = pageNumber,
            PageSize = pageSize,

        };

        Size = totalCount;

        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        AddRange(list);
    }

    public static PagedList<T> ToPagedList(IQueryable<T> query, int currentPage, int pageSize)
    {
        var count = query.Count();
        var items = query.Skip((currentPage - 1) * pageSize).Take(pageSize).ToList();
        return new PagedList<T>(items, count, currentPage, pageSize);
    }
}

public class Pageable
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}