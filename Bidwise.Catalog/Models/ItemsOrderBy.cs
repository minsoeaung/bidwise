using System.Text.Json.Serialization;

namespace Bidwise.Catalog.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ItemsOrderBy
{
    SimpleOrder = 0,
    Name = 1,
    EndingSoon = 2,
    NewlyListed = 3,
}
