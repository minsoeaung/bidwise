import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";
import { COMMENTS } from "../queries/usePaginatedComments";
import { toaster } from "@/components/ui/toaster";

export interface CommentDeleteDto {
  id: number;
}

export const useDeleteComment = (itemId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (payload: CommentDeleteDto) => {
      return await ApiClient.delete(`api/comments/${payload.id}`);
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries([COMMENTS, String(itemId)]);
      },
      onError: async () => {
        toaster.create({
          title: "Failed to delete comment!",
          type: "error",
        });
      },
    }
  );
};
