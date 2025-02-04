namespace Bidwise.Catalog.Entities;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public IEnumerable<Item> Items { get; set; }
}
