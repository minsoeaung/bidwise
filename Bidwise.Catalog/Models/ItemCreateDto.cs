namespace Bidwise.Catalog.Models;

public class ItemCreateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string? Note { get; set; }
    public string? CategoryName { get; set; }
    public double StartingBid { get; set; }
    public bool Vickrey { get; set; }
    public DateTimeOffset EndDate { get; set; } // <-- Frontend must send ISO 8601 format
    public IEnumerable<IFormFile> Images { get; set; } = [];
    public IEnumerable<string> ImageLabels { get; set; } = []; // <-- for later
    public string? Attributes { get; set; }
}

public class AttributeCreateDto
{
    public string Label { get; set; }
    public string Value { get; set; }
}

