import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";
import { BIDS } from "../queries/useBids";

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
        // toast
      },
    }
  );
};
