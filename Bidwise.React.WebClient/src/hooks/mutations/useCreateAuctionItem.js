import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ApiClient } from "../../api/apiClient";

export const useCreateAuctionItem = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation(
    async (data) => {
      const formData = new FormData();

      formData.append("Name", "Comic Book");
      formData.append("Description", "desc");
      formData.append("CategoryName", "Book");
      formData.append("StartingBid", "50");
      formData.append("EndDate", new Date().toUTCString());

      // images.forEach((image, index) => {
      //   formData.append(`Images[${index}].Label`, image.label || ""); // Handle optional Label
      //   formData.append(`Images[${index}].File`, image.file); // Assuming image.file is a File object
      //   formData.append(`Images[${index}].Name`, image.name || ""); // Handle optional Name
      // });

      return await ApiClient.post(`api/catalog`, formData);
    },
    {
      onSuccess: async () => {
        toast({
          title: "Success",
          status: "success",
          isClosable: true,
        });
      },
    }
  );
};
