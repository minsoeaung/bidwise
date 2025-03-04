import { SellAuctionDto } from "@/hooks/queries/useSellAuctions";

export const getItemAuctionedSummary = (itemAuctions: SellAuctionDto[]) => {
  return `${itemAuctions.length} auctions listed, ${
    itemAuctions.filter((d) => d.buyerId).length
  } sold`;
};
