import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ApiClient } from "../../api/apiClient";
import { toaster } from "@/components/ui/toaster";

export interface ItemCreateDto {
  name: string;
  description: string;
  categoryName: string;
  startingBid: number;
  endDate: string;
  images: ImageCreateDto[];
  vickrey: boolean;
}

export interface ImageCreateDto {
  label: string | null;
  file: File;
}

export const useCreateAuctionItem = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation(
    async (payload: ItemCreateDto) => {
      const formData = new FormData();

      formData.set("name", payload.name);

      formData.set("description", payload.description);

      if (payload.categoryName)
        formData.set("categoryName", payload.categoryName);

      formData.set("startingBid", String(payload.startingBid));
      formData.set("vickrey", String(payload.vickrey));
      formData.set("endDate", new Date(payload.endDate).toISOString());

      if (payload.images.length) {
        payload.images.forEach((image, index) => {
          // if (image.label) formData.append(`images.label`, image.label);

          formData.append(`images`, image.file);
        });
      }

      return await ApiClient.post(`api/catalog`, formData);
    },
    {
      onSuccess: async () => {
        toaster.create({
          title: "Auction Created",
          type: "success",
        });
      },
    }
  );
};
