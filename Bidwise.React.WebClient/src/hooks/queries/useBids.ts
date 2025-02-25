import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";

export type BidDto = {
  id: number;
  itemId: number;
  bidderId: number;
  bidderName: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

export const BIDS = "BIDS";

export const useBids = (itemId: number | undefined) => {
  return useQuery(
    [BIDS, String(itemId)],
    async () =>
      await ApiClient.get<never, BidDto[]>(`api/bids?itemId=${itemId}`),
    {
      enabled: typeof itemId === "number" && itemId > 0,
    }
  );
};
