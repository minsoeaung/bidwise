namespace Bidwise.Catalog.Models;

public class ItemUpdateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string? Note { get; set; }
    public string? CategoryName { get; set; }
    public IEnumerable<IFormFile> Images { get; set; } = [];
    public string? Attributes { get; set; }
}
