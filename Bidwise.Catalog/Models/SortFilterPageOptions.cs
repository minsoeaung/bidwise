namespace Bidwise.Catalog.Models;

public class SortFilterPageOptions
{
    public const int DefaultPageSize = 20;

    private int _pageNum = 1;

    private int _pageSize = DefaultPageSize;

    public int[] PageSizes = new[] { 5, DefaultPageSize, 20, 50, 100, 500, 1000 };

    public OrderByOptions OrderByOptions { get; set; }

    public ItemsFilterBy FilterBy { get; set; }

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

    public string? PrevCheckState { get; set; }


    public void SetupRestOfDto<T>(IQueryable<T> query)
    {
        NumPages = (int)Math.Ceiling((double)query.Count() / PageSize);
        PageNum = Math.Min(
            Math.Max(1, PageNum), NumPages);

        var newCheckState = GenerateCheckState();
        if (PrevCheckState != newCheckState)
            PageNum = 1;

        PrevCheckState = newCheckState;
    }

    //----------------------------------------
    //private methods

    /// <summary>
    ///     This returns a string containing the state of the SortFilterPage data
    ///     that, if they change, should cause the PageNum to be set back to 0
    /// </summary>
    /// <returns></returns>
    private string GenerateCheckState()
    {
        return $"{(int)FilterBy},{FilterValue},{PageSize},{NumPages}";
    }
}
