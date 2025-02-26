import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";
import { COMMENTS } from "../queries/usePaginatedComments";
import { toaster } from "@/components/ui/toaster";

export interface CommentUpdateDto {
  id: number;
  commentText: string;
}

export const useUpdateComment = (itemId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (payload: CommentUpdateDto) => {
      return await ApiClient.post(`api/comments`, {
        commentId: payload.id,
        itemId: 0,
        commentText: payload.commentText,
      });
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries([COMMENTS, String(itemId)]);
      },
      onError: async () => {
        toaster.create({
          title: "Failed to edit comment!",
          type: "error",
        });
      },
    }
  );
};
