import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ApiClient } from "../../api/apiClient";
import { toaster } from "@/components/ui/toaster";

export interface ItemCreateDto {
  name: string;
  description: string;
  note: string | null;
  categoryName: string;
  startingBid: number;
  endDate: string;
  images: ImageCreateDto[];
  attributes: AttributeCreateDto[];
  vickrey: boolean;
}

export interface ImageCreateDto {
  label: string | null;
  file: File;
}

export interface AttributeCreateDto {
  label: string;
  value: string;
}

export const useCreateAuctionItem = () => {
  return useMutation(
    async (payload: ItemCreateDto) => {
      const formData = new FormData();

      formData.set("name", payload.name);

      formData.set("description", payload.description);
      if (payload.note) formData.set("note", payload.note);

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

      if (payload.attributes.length) {
        formData.append("attributes", JSON.stringify(payload.attributes));
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
