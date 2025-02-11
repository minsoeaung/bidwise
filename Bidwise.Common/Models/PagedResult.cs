namespace Bidwise.Common.Models;

public class PagedResult<T>
{
    public Pageable Pageable { get; set; }

    public int Size { get; set; }

    public int TotalPages { get; set; }

    public IEnumerable<T> Content { get; set; }
}
