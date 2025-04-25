"use client";

import { getAllOrders, getProducts } from "@/app/(main)/actions";
import { useQuery } from "@tanstack/react-query";

const orderQueryParams = {
        page:1,
        limit: 10,
    }
export function useOrders(page = 1, limit = 10) {
    // type OrderQueryParams = {
    //     page?: number;
    //     limit?: number;
    //     search?: string;
    //     sortBy?: string;
    //     sortOrder?: "asc" | "desc";
    //     status?: string;
    // }
    
  return useQuery({
    queryKey: ["orders", page, limit], // Key includes pagination to prevent stale cache
    queryFn: () => getAllOrders({page, limit}),
    staleTime: 0, // Always fetch fresh data
    retry: 2, // Retry twice if request fails
  });
}
