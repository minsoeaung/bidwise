import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "../../api/apiClient";

export type CategoryDto = {
  id: number;
  name: string;
};

export const CATEGORIES = "categories";

export const useCategories = () => {
  return useQuery(
    [CATEGORIES],
    async () => await ApiClient.get<never, CategoryDto[]>(`api/categories`),
    {
      select: (data) => {
        if (Array.isArray(data))
          return [{ id: null, name: "All categories" }, ...data];

        return data;
      },
    }
  );
};
