// components/DashboardSummary.tsx
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useDashboardSummary } from "@/hooks/use-dashboard-summary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Individual summary card component
interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading: boolean;
  error?: boolean;
  variant?: "default" | "up" | "down";
  iconColor: string;
}

const SummaryCard = ({
  title,
  value,
  icon,
  loading,
  error,
  variant = "default",
  iconColor,
}: SummaryCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          {loading ? (
            <Skeleton className="h-10 w-28" />
          ) : error ? (
            <div className="flex items-center text-red-500">
              <AlertCircle size={16} className="mr-1" />
              <span className="text-sm">Failed to load</span>
            </div>
          ) : (
            <h3 className="text-3xl font-bold">{value}</h3>
          )}
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 bg-${iconColor}-100`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Main dashboard summary component
export default function DashboardSummary() {
  const { data, isLoading, isError, refetch, isRefetching } =
    useDashboardSummary();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
        >
          <RefreshCw
            size={16}
            className={`mr-2 ${isRefetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="TODAY REVENUE"
          value={
            isLoading || isError
              ? "-"
              : formatCurrency(data?.data?.revenueKsh || 0)
          }
          icon={<DollarSign className="text-blue-500" size={24} />}
          loading={isLoading}
          error={isError}
          iconColor="blue"
        />

        {/* <SummaryCard
          title="VISITORS"
          value={
            isLoading || isError ? "-" : data?.visitors?.toLocaleString() || 0
          }
          icon={<Users className="text-green-500" size={24} />}
          loading={isLoading}
          error={isError}
          iconColor="green"
        /> */}

        <SummaryCard
          title="TRANSACTIONS"
          value={
            isLoading || isError
              ? "-"
              : data?.data?.totalOrders?.toLocaleString() || 0
          }
          icon={<ShoppingCart className="text-red-500" size={24} />}
          loading={isLoading}
          error={isError}
          iconColor="red"
        />

        {/* <SummaryCard
          title="INVENTORY"
          value={
            isLoading || isError ? "-" : data?.inventory?.toLocaleString() || 0
          }
          icon={<Package className="text-purple-500" size={24} />}
          loading={isLoading}
          error={isError}
          iconColor="purple"
        /> */}
      </div>
    </div>
  );
}
