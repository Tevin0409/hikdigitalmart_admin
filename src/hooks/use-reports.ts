import { useQuery } from "@tanstack/react-query";

import { lowInStockReport, orderStatusReport, salesSummaryReport, technicianRegistrationReport, topProductsReport, userRegistrationsReport, verifiedUsersReport, wishlistsTrendsReport } from "@/app/(main)/actions";

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
        queryKey: ["verified-user-report"],
        queryFn: () => salesSummaryReport(),
        staleTime: 0,
        retry: 2,
    });
};

export const useOrderStatusReport = () => {
    return useQuery({
        queryKey: ["verified-user-report"],
        queryFn: () => orderStatusReport(),
        staleTime: 0,
        retry: 2,
    });
};

export const useTopProductsReport = () => {
    return useQuery({
        queryKey: ["verified-user-report"],
        queryFn: () => topProductsReport(),
        staleTime: 0,
        retry: 2,
    });
};

export const uselowInStockReport = (quantity = 10) => {
    return useQuery({
        queryKey: ["verified-user-report"],
        queryFn: () => lowInStockReport(quantity),
        staleTime: 0,
        retry: 2,
    });
};

export const useWishlistsTrendsReport = () => {
    return useQuery({
        queryKey: ["verified-user-report"],
        queryFn: () => wishlistsTrendsReport(),
        staleTime: 0,
        retry: 2,
    });
};

export const usetechnicianRegistrationReport = () => {
    return useQuery({
        queryKey: ["verified-user-report"],
        queryFn: () => technicianRegistrationReport(),
        staleTime: 0,
        retry: 2,
    });
};