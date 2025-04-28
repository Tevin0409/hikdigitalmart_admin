"use client";

import { getAllUsers } from "@/app/(main)/actions";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {    
  return useQuery({
    queryKey: ["users"], // Key includes pagination to prevent stale cache
    queryFn: () => getAllUsers(),
    staleTime: 0, // Always fetch fresh data
    retry: 2, // Retry twice if request fails
  });
}
