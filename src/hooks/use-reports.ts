import { useQuery } from "@tanstack/react-query";

import {
  getAllReviewsAction,
  lowInStockReport,
  orderStatusReport,
  salesSummaryReport,
  technicianRegistrationReport,
  topProductsReport,
  userRegistrationsReport,
  verifiedUsersReport,
  wishlistsTrendsReport,
} from "@/app/(main)/actions";

export const useUserRegistrationsReport = () => {
  return useQuery({
    queryKey: ["user-registration-report"],
    queryFn: () => userRegistrationsReport(),
    staleTime: 0,
    retry: 2,
  });
};

export const useVerifiedUserReport = () => {
  return useQuery({
    queryKey: ["verified-user-report"],
    queryFn: () => verifiedUsersReport(),
    staleTime: 0,
    retry: 2,
  });
};

export const useSalesSummaryReport = () => {
  return useQuery({
    queryKey: ["sales-summary-report"],
    queryFn: () => salesSummaryReport(),
    staleTime: 0,
    retry: 2,
  });
};

export const useOrderStatusReport = () => {
  return useQuery({
    queryKey: ["order-status-report"],
    queryFn: () => orderStatusReport(),
    staleTime: 0,
    retry: 2,
  });
};

export const useTopProductsReport = () => {
  return useQuery({
    queryKey: ["top-products-report"],
    queryFn: () => topProductsReport(),
    staleTime: 0,
    retry: 2,
  });
};

export const uselowInStockReport = (quantity = 100) => {
  return useQuery({
    queryKey: ["low-in-stock-report", quantity],
    queryFn: () => lowInStockReport(quantity),
    staleTime: 0,
    retry: 2,
  });
};

export const useWishlistsTrendsReport = () => {
  return useQuery({
    queryKey: ["wishlists-trends-report"],
    queryFn: () => wishlistsTrendsReport(),
    staleTime: 0,
    retry: 2,
  });
};

export const usetechnicianRegistrationReport = () => {
  return useQuery({
    queryKey: ["technician-registration-report"],
    queryFn: () => technicianRegistrationReport(),
    staleTime: 0,
    retry: 2,
  });
};

export function useReviews({
  page = 1,
  limit = 10,
  searchTerm = "",
  refreshTrigger = 0,
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  refreshTrigger?: number;
}) {
  return useQuery<UsersFetchResponse<unknown>, Error>({
    queryKey: ["reviews", { page, limit, searchTerm, refreshTrigger }],
    queryFn: () =>
      getAllReviewsAction({
        page,
        limit,
        searchTerm,
      }),
    // keepPreviousData: true,
    staleTime: 1000 * 60,
  });
}
