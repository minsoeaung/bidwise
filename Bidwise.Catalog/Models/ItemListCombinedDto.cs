namespace Bidwise.Catalog.Models;

public class ItemListCombinedDto
{
    public ItemListCombinedDto(SortFilterPageOptions sortFilterPageData, IEnumerable<ItemListDto> itemsList)
    {
        SortFilterPageData = sortFilterPageData;
        ItemsList = itemsList;
    }

    public SortFilterPageOptions SortFilterPageData { get; private set; }

    public IEnumerable<ItemListDto> ItemsList { get; private set; }
}
