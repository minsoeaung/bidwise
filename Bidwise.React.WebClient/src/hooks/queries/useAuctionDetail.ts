import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";

export const AUCTION_DETAIL = "Auction Detail";

export type AuctionDto = {
  id: number;
  name: string;
  description: string;
  note: string | null;
  startDate: string;
  endDate: string;
  vickrey: boolean;
  currentHighestBid: number | null;
  currentHighestBidderId: number | null;
  doubleMetaphone: string;
  sellerId: number;
  sellerName: string;
  buyerId: number | null;
  buyerName: string | null;
  buyerPayAmount: number | null;
  status: string;
  timeLeft: string;
  images: ImageDto[];
  attributes: AttributeDto[];
  startingBid: number;
  categoryName: string | null;
};

export type ImageDto = {
  name: string;
  label: string | null;
};

export type AttributeDto = {
  id: number;
  label: string;
  value: string;
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
