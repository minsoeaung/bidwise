import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";
import { AuctionDto } from "./useAuctionDetail";

export interface SellAuctionDto extends AuctionDto {}

export const SELL_AUCTIONS = "SELL_AUCTIONS";

export const useSellAuctions = (userId: number | null) => {
  return useQuery(
    [SELL_AUCTIONS, String(userId)],
    async () =>
      await ApiClient.get<never, SellAuctionDto[]>(
        `api/catalog/sell?userId=${userId}`
      ),
    {
      enabled: !!userId && userId > 0,
    }
  );
};
