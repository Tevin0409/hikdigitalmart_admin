"use client";

import { getProducts } from "@/app/(main)/actions";
import { useQuery } from "@tanstack/react-query";

export function useProducts(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["products", page, limit], // Key includes pagination to prevent stale cache
    queryFn: () => getProducts(page, limit),
    staleTime: 0, // Always fetch fresh data
    retry: 2, // Retry twice if request fails
  });
}
