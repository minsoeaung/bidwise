import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";

export const AUCTION_DETAIL = "Auction Detail";

export type AuctionDto = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  currentHighestBid: number | null;
  doubleMetaphone: string;
  sellerId: number;
  sellerName: string;
  buyerId: number | null;
  buyerName: string | null;
  status: string;
  timeLeft: string;
  images: ImageDto[];
  startingBid: number;
};

export type ImageDto = {
  name: string;
  label: string | null;
};

// type of "id" is set as string | undefined bc it is an query param
// just for convinence
export const useAuctionDetail = (id: string | undefined) => {
  return useQuery(
    [AUCTION_DETAIL, String(id)],
    async () => await ApiClient.get<never, AuctionDto>(`api/catalog/${id}`),
    {
      enabled: typeof Number(id) === "number" && Number(id) > 0,
    }
  );
};
