namespace Bidwise.Catalog.Models;

public class ItemCreateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string? CategoryName { get; set; }
    public double StartingBid { get; set; }
    public bool Vickrey { get; set; }
    public DateTimeOffset EndDate { get; set; } // <-- Frontend must send ISO 8601 format
    public IEnumerable<IFormFile> Images { get; set; } = [];
}

//public class ImageCreateDto
//{
    //public string? Label { get; set; }
    //public IFormFile File { get; set; }
//}