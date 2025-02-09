import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";

export interface CommentCreateDto {
  itemId: number;
  commentText: string;
}

export const useCreateComment = () => {
  return useMutation(
    async (payload: CommentCreateDto) => {
      return await ApiClient.post(`api/comments`, payload);
    },
    {
      onSuccess: async () => {
        // toast
      },
    }
  );
};
