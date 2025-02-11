import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";
import { PagedResult } from "./usePaginatedAuctions";

export type CommentDto = {
  id: number;
  itemId: number;
  userId: number;
  userName: string;
  commentText: string;
  createdAt: string;
  updatedAt: string;
};

export const COMMENTS = "Comments";

const fetchComments = async ({
  queryKey,
}: QueryFunctionContext<[string, string]>): Promise<
  PagedResult<CommentDto>
> => {
  const [_, itemId] = queryKey;

  return await ApiClient.get(`api/comments?itemId=${itemId}`);
};

export const usePaginatedComments = (itemId: string | undefined) => {
  return {
    ...useQuery([COMMENTS, String(itemId)], fetchComments, {
      keepPreviousData: true,
      enabled: typeof Number(itemId) === "number" && Number(itemId) > 0,
    }),
  };
};
