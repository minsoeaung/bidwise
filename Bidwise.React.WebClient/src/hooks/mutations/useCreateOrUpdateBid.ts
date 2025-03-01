import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";
import { BIDS } from "../queries/useBids";
import { AUCTION_DETAIL } from "../queries/useAuctionDetail";

export interface BidCreateOrUpdateDto {
  itemId: number;
  amount: number;
}

export const useCreateOrUpdateBid = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (payload: BidCreateOrUpdateDto) => {
      return await ApiClient.post(`api/bids`, payload);
    },
    {
      onSuccess: async (_, payload) => {
        queryClient.invalidateQueries([BIDS, String(payload.itemId)]);
        setTimeout(() => {
          queryClient.invalidateQueries([
            AUCTION_DETAIL,
            String(payload.itemId),
          ]);
        }, 2000);
      },
    }
  );
};
