namespace Bidwise.Catalog.Entities;

public class Attribute
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public string Label { get; set; }
    public string Value { get; set; }
}
