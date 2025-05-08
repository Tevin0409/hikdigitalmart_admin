// components/DashboardSummary.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartConfig } from "@/components/ui/chart";
import { AreaChartComponent } from "@/components/ui/charts/areachart";
import { PieChartComponent } from "@/components/ui/charts/piechart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useDashboardSummary } from "@/hooks/use-dashboard-summary";
import { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  DollarSign,
  Package,
  RefreshCw,
  ShoppingCart
} from "lucide-react";
import React from "react";

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
    <div className="bg-white dark:bg-slate-700 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-600">
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
            <h3 className="text-2xl lg:text-3xl font-bold">{value}</h3>
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

  const [duration, setDuration] = React.useState<DurationKey>("monthly");

  // Predefined color palettes
  const palette = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const areaConfig = React.useMemo(
    () => ({
      value: { label: "KES", color: palette[0] },
      period: { label: "Period" },
    } satisfies ChartConfig),
    []
  )

  const areaChartData = React.useMemo(() => {
    const bucket = data?.data?.salesPerDuration?.[duration] ?? {}
    return Object.entries(bucket).map(([period, value]) => ({ period, value }))
  }, [data, duration])

  const pieData = React.useMemo(() => {
    const cat = data?.data?.salesByCategory ?? {}
    return Object.entries(cat).map(([category, count], i) => ({
      category,
      count,
      fill: palette[i % palette.length],
    }))
  }, [data])

  const pieConfig = React.useMemo(
    () =>
    ({
      count: { label: "Orders", color: palette[0] },
      ...Object.fromEntries(
        pieData.map((d) => [
          d.category,
          { label: d.category, color: d.fill! },
        ])
      ),
    } satisfies ChartConfig),
    [pieData]
  );


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

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <SummaryCard
          title="INVENTORY"
          value={
            isLoading || isError ? "-" : formatCurrency(data?.data?.inventoryValue || 0)
          }
          icon={<Package className="text-purple-500" size={24} />}
          loading={isLoading}
          error={isError}
          iconColor="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-700 rounded-md shadow border border-gray-100 dark:border-gray-600 w-full max-h-96 p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Sales Analytics</h2>
            <Select onValueChange={(v) => setDuration(v as DurationKey)} value={duration}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <AreaChartComponent
              data={areaChartData}
              dataKey="value"
              xAxisKey="period"
              config={areaConfig}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-700 rounded-md shadow border border-gray-100 dark:border-gray-600 w-full max-h-96 p-4 overf">
          <div className="mb-1 text-xl font-semibold">
            Sales by category
          </div>
          <PieChartComponent
            data={pieData}
            dataKey="count"
            nameKey="category"
            config={pieConfig}
            title=""
          />
        </div>
      </div>

      {/* Top Customers and Top Models Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white dark:bg-slate-700 rounded-md shadow border border-gray-100 dark:border-gray-600 w-full p-4 overflow-auto">
          <div className="font-semibold text-xl mb-2">Top Customers</div>
          <Table>
            <TableCaption>Top spending customers</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isError ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    {isLoading ? "Loading..." : "Error loading customers"}
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.topCustomers.map((cust) => (
                  <TableRow key={cust.customerId}>
                    <TableCell>{cust.customerId}</TableCell>
                    <TableCell>{cust.name}</TableCell>
                    <TableCell>{cust.email}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(cust.totalSpent)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Top Models */}
        <div className="bg-white dark:bg-slate-700 rounded-md shadow border border-gray-100 dark:border-gray-600 w-full p-4 overflow-auto">
          <div className="font-semibold text-xl mb-2">Top Models</div>
          <Table>
            <TableCaption>Most ordered models</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Model ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Quantity Ordered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isError ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    {isLoading ? "Loading..." : "Error loading models"}
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.topModels.map((model) => (
                  <TableRow key={model.modelId}>
                    <TableCell>{model.modelId}</TableCell>
                    <TableCell>{model.name}</TableCell>
                    <TableCell className="text-right">
                      {model.quantityOrdered}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
