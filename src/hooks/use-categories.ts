import { useQuery } from "@tanstack/react-query";

import { getCategories, getSubCategories } from "@/app/(main)/actions";

export const useFetchCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    staleTime: 0,
    retry: 2,
  });
};

export const useFetchSubCategories = () => {
  return useQuery({
    queryKey: ["subcategories"],
    queryFn: () => getSubCategories(),
    staleTime: 0,
    retry: 2,
  });
};
