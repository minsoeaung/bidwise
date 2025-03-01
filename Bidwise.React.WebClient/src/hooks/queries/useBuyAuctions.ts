import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";
import { AuctionDto } from "./useAuctionDetail";
import { BidDto } from "./useBids";

export interface BuyAuctionDto extends BidDto {
  item: AuctionDto;
}

export const BUY_AUCTIONS = "BUY_AUCTIONS";

export const useBuyAuctions = (userId: number | null) => {
  return useQuery(
    [BUY_AUCTIONS, String(userId)],
    async () => await ApiClient.get<never, BuyAuctionDto[]>(`api/catalog/buy`),
    {
      enabled: !!userId,
    }
  );
};
