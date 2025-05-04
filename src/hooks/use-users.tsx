"use client";

import { getAllRolesAction, getAllUsers } from "@/app/(main)/actions";
import { useQuery } from "@tanstack/react-query";

export function useUsers({
  page = 1,
  limit = 10,
  searchTerm = "",
  roleId = "",
  refreshTrigger = 0, 
}: {
  page: number;
  limit: number;
  searchTerm?: string;
  roleId?: string;
  refreshTrigger?: number; 
}) {
  return useQuery({
    queryKey: ["users", { page, limit, searchTerm, roleId, refreshTrigger }], 
    queryFn: () =>
      getAllUsers({
        page,
        limit,
        searchTerm,
        roleId,
      }),
  });
}

export const useUsersRoles = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getAllRolesAction(),
    staleTime: 0,
    retry: 2,
  });
};
