"use client";

import { getAllOrders } from "@/app/(main)/actions";
import { useQuery } from "@tanstack/react-query";

export function useOrders(page = 1, limit = 10) {    
  return useQuery({
    queryKey: ["orders", page, limit], // Key includes pagination to prevent stale cache
    queryFn: () => getAllOrders({page, limit}),
    staleTime: 0, // Always fetch fresh data
    retry: 2, // Retry twice if request fails
  });
}
