import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";

const fetchAuctions = async ({ queryKey }) => {
  const searchParams = new URLSearchParams(queryKey[1]);

  return await ApiClient.get(`api/catalog/3`);
};

export const usePaginatedAuctions = (searchParams) => {
  return {
    ...useQuery(["auctions", searchParams], fetchAuctions, {
      keepPreviousData: true,
    }),
  };
};
