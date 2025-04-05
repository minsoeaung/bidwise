import { ItemCard } from "@/components/ItemCard";
import { ItemCardLoading } from "@/components/ItemCard/ItemCardLoading";
import { usePaginatedAuctions } from "@/hooks/queries/usePaginatedAuctions";
import { SimpleGrid } from "@chakra-ui/react";
import { memo } from "react";
import { Link } from "react-router-dom";

type Props = {
  id: number;
};

export const AuctionsEndingSoon = memo(({ id }: Props) => {
  const { data, isLoading } = usePaginatedAuctions(
    "OrderBy=EndingSoon&PageSize=10"
  );

  if (isLoading) {
    return (
      <SimpleGrid columns={2} gap="40px">
        {Array(6)
          .fill(1)
          .map((_, index) => (
            <ItemCardLoading key={index} />
          ))}
      </SimpleGrid>
    );
  }

  if (Array.isArray(data?.content)) {
    if (data.content.length > 0) {
      const filteredList = data.content.filter((a) => a.id !== id);

      return (
        <SimpleGrid columns={2} gap="40px">
          {filteredList.map((auction) => (
            <Link to={`/auctions/${auction.id}`} key={auction.id}>
              <ItemCard auction={auction} badgeSize="sm" />
            </Link>
          ))}
        </SimpleGrid>
      );
    } else {
      return "no";
    }
  }

  return null;
});
