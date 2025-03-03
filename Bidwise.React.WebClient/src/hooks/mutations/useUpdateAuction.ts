import { ApiClient } from "@/api/apiClient";
import { toaster } from "@/components/ui/toaster";
import { useMutation } from "@tanstack/react-query";
import { AttributeCreateDto, ImageCreateDto } from "./useCreateAuctionItem";

export type ItemUpdateDto = {
  name: string;
  description: string;
  note: string | null;
  categoryName: string | null;
  images: ImageCreateDto[];
  attributes: AttributeCreateDto[];
};

export const useUpdateAuction = (id: number) => {
  return useMutation(
    async (payload: ItemUpdateDto) => {
      const formData = new FormData();

      formData.set("name", payload.name);
      formData.set("description", payload.description);
      if (payload.note) formData.set("note", payload.note);
      if (payload.categoryName)
        formData.set("categoryName", payload.categoryName);

      if (payload.images.length) {
        payload.images.forEach((image) => {
          formData.append(`images`, image.file);
        });
      }

      if (payload.attributes)
        formData.append("attributes", JSON.stringify(payload.attributes));

      return await ApiClient.put(`api/catalog/${id}`, formData);
    },
    {
      onSuccess: async () => {
        toaster.create({
          title: "Auction Updated",
          type: "success",
        });
      },
    }
  );
};
