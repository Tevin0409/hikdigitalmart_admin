import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/app/(main)/actions";

export function useDashboardSummary() {
  const queryFn = () =>
    getDashboardSummary() as Promise<FetchResponse<SummaryData>>;
  return useQuery<FetchResponse<SummaryData>>({
    queryKey: ["dashboardSummary"],
    queryFn,

    refetchInterval: 5 * 60 * 1000,

    retry: 3,

    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),

    staleTime: 60 * 1000,
  });
}
