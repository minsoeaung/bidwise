import { BuyAuctionDto } from "@/hooks/queries/useBuyAuctions";
import { isTheAuctionEnded } from "./isTheAuctionEnded";

export const getBidHistorySummary = (
  bids: BuyAuctionDto[],
  currentUserId: number
) => {
  return `Bid on ${bids.length} auctions, ${
    bids.filter((d) => d.item.buyerId === currentUserId).length
  } wins, ${
    bids.filter((b) => !isTheAuctionEnded(b.item.endDate)).length
  } active bids`;
};
