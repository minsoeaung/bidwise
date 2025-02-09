import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";
import { AuctionDto } from "./useAuctionDetail";

export type PagedResponse<T> = {
  paging: {
    orderBy: number;
    filterBy: number;
    filterValue: string | null;
    pageNum: number;
    pageSize: number;
    numPages: number;
  };
  data: T[];
};

export const AUCTIONS = "Auctions";

const fetchAuctions = async ({
  queryKey,
}: QueryFunctionContext<[string, string]>): Promise<
  PagedResponse<AuctionDto>
> => {
  const searchParams = new URLSearchParams(queryKey[1]);

  return await ApiClient.get(`api/catalog?FilterBy=0&FilterValue=`);
};

export const usePaginatedAuctions = (searchParams) => {
  return {
    ...useQuery([AUCTIONS, searchParams], fetchAuctions, {
      keepPreviousData: true,
    }),
  };
};
