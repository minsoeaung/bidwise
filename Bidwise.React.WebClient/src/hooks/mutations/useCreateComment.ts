import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";
import { COMMENTS } from "../queries/usePaginatedComments";

export interface CommentCreateDto {
  itemId: number;
  commentText: string;
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (payload: CommentCreateDto) => {
      return await ApiClient.post(`api/comments`, payload);
    },
    {
      onSuccess: async (_, payload) => {
        queryClient.invalidateQueries([COMMENTS, String(payload.itemId)]);
        // toast
      },
    }
  );
};
