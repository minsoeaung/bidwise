import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
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
  pageParam = 0,
}: QueryFunctionContext<[string, string]>): Promise<
  PagedResult<CommentDto>
> => {
  const [_, itemId] = queryKey;

  return await ApiClient.get(
    `api/comments?itemId=${itemId}&page=${pageParam}&size=10`
  );
};

export const usePaginatedComments = (itemId: string | undefined) => {
  return {
    ...useInfiniteQuery([COMMENTS, String(itemId)], fetchComments, {
      keepPreviousData: true,
      enabled: typeof Number(itemId) === "number" && Number(itemId) > 0,
      getNextPageParam: (lastPage) => {
        // @ts-ignore
        if (!lastPage.last) {
          return lastPage.pageable.pageNumber + 1;
        } else {
          return undefined;
        }
      },
    }),
  };
};
