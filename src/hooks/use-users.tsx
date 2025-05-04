"use client";

import {
  createUserAction,
  getAllRolesAction,
  getAllUsers,
  updateUserAction,
} from "@/app/(main)/actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Hook to fetch users with pagination and filtering
export function useUsers({
  page = 1,
  limit = 10,
  searchTerm = "",
  roleId = "",
  refreshTrigger = 0,
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  roleId?: string;
  refreshTrigger?: number;
}) {
  return useQuery<UsersFetchResponse<unknown>, Error>({
    queryKey: ["users", { page, limit, searchTerm, roleId, refreshTrigger }],
    queryFn: () =>
      getAllUsers({
        page,
        limit,
        searchTerm,
        roleId,
      }),
    // keepPreviousData: true,
    staleTime: 1000 * 60,
  });
}
export const useUsersRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getAllRolesAction,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => createUserAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    retry: 2,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserInfoData }) =>
      updateUserAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    retry: 2,
  });
};
