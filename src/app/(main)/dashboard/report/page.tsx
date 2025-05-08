"use client";

import { useState } from "react";
import {
  Search,
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  Heart,
  AlertTriangle,
  CheckCircle,
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageContainer from "@/components/layout/page-container";
import {
  useOrderStatusReport,
  useSalesSummaryReport,
  usetechnicianRegistrationReport,
  useTopProductsReport,
  useUserRegistrationsReport,
  useVerifiedUserReport,
  useWishlistsTrendsReport,
  uselowInStockReport,
} from "@/hooks/use-reports";

interface ReportItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: "users" | "sales" | "inventory" | "other";
  lastUpdated: string;
  render: () => React.ReactNode;
  isLoading: boolean;
  error: Error | null;
}

interface LowInStockItem {
  id: string;
  quantity: number;
  model: {
    name: string;
    minimumStock: number;
  };
}

interface MonthlyData<T> {
  data: Record<string, T>;
}

interface ProductCount {
  [product: string]: number;
}

interface OrderStatusData {
  [status: string]: number;
}

interface UserRegistrationData {
  USER?: number;
  SUDO?: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(value);
};

const EmptyState = () => {
  return (
    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed bg-gray-50/50">
      <p className="text-center text-sm text-gray-500">
        No data available for this report
      </p>
    </div>
  );
};

export default function ReportsDashboard() {
  const {
    data: userRegistrationData,
    isLoading: userRegistrationLoading,
    error: userRegistrationError,
  } = useUserRegistrationsReport();

  const {
    data: verifiedUserData,
    isLoading: verifiedUserLoading,
    error: verifiedUserError,
  } = useVerifiedUserReport();

  const {
    data: salesSummaryData,
    isLoading: salesSummaryLoading,
    error: salesSummaryError,
  } = useSalesSummaryReport();

  const {
    data: orderStatusData,
    isLoading: orderStatusLoading,
    error: orderStatusError,
  } = useOrderStatusReport();

  const {
    data: topProductsData,
    isLoading: topProductsLoading,
    error: topProductsError,
  } = useTopProductsReport();

  const {
    data: lowInStockData,
    isLoading: lowInStockLoading,
    error: lowInStockError,
  } = uselowInStockReport();

  const {
    data: wishlistsTrendsData,
    isLoading: wishlistsTrendsLoading,
    error: wishlistsTrendsError,
  } = useWishlistsTrendsReport();

  const {
    data: technicianRegistrationData,
    isLoading: technicianRegistrationLoading,
    error: technicianRegistrationError,
  } = usetechnicianRegistrationReport();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | ReportItem["category"]
  >("all");
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const allReports: ReportItem[] = [
    {
      id: "user-registrations",
      label: "User Registrations",
      description: "New user signups and registration trends",
      icon: <Users className="h-6 w-6 text-blue-500" />,
      category: "users",
      lastUpdated: "Today",
      isLoading: userRegistrationLoading,
      error: userRegistrationError,
      render: () => {
        if (!userRegistrationData) return <EmptyState />;

        let totalUsers = 0;
        let totalAdmin = 0;

        Object.entries(userRegistrationData?.data).forEach(([_, data]) => {
          totalUsers += (data as UserRegistrationData).USER || 0;
          totalAdmin += (data as UserRegistrationData).SUDO || 0;
        });

        const monthlyData = Object.entries(userRegistrationData?.data).map(
          ([month, data]) => (
            <div
              key={month}
              className="flex items-center justify-between border-b py-2"
            >
              <span className="font-medium">{month}</span>
              <div className="space-x-4">
                <Badge variant="outline" className="bg-blue-50">
                  Regular: {(data as UserRegistrationData).USER || 0}
                </Badge>
                <Badge variant="outline" className="bg-purple-50">
                  Admin: {(data as UserRegistrationData).SUDO || 0}
                </Badge>
              </div>
            </div>
          )
        );

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <h4 className="text-sm font-medium text-blue-900">
                  Total Regular Users
                </h4>
                <p className="text-2xl font-bold text-blue-700">{totalUsers}</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <h4 className="text-sm font-medium text-purple-900">
                  Total Admin Users
                </h4>
                <p className="text-2xl font-bold text-purple-700">
                  {totalAdmin}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Monthly Breakdown</h4>
              <div className="max-h-60 overflow-y-auto rounded-md border p-2">
                {monthlyData}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "verified-users",
      label: "Verified Users",
      description: "Users who completed identity verification",
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      category: "users",
      lastUpdated: "Yesterday",
      isLoading: verifiedUserLoading,
      error: verifiedUserError,
      render: () => {
        if (!verifiedUserData) return <EmptyState />;

        const totalVerified = Object.values(verifiedUserData.data).reduce(
          (sum, count) => (sum as number) + (count as number),
          0
        );

        const monthlyData = Object.entries(verifiedUserData.data).map(
          ([month, count]) => (
            <div
              key={month}
              className="flex items-center justify-between border-b py-2"
            >
              <span className="font-medium">{month}</span>
              <Badge variant="outline" className="bg-green-50">
                {count as number} users
              </Badge>
            </div>
          )
        );

        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4">
              <h4 className="text-sm font-medium text-green-900">
                Total Verified Users
              </h4>
              <p className="text-2xl font-bold text-green-700">
                {totalVerified as number}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Monthly Breakdown</h4>
              <div className="max-h-60 overflow-y-auto rounded-md border p-2">
                {monthlyData}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "sales-summary",
      label: "Sales Summary",
      description: "Overview of sales performance and metrics",
      icon: <BarChart3 className="h-6 w-6 text-indigo-500" />,
      category: "sales",
      lastUpdated: "Today",
      isLoading: salesSummaryLoading,
      error: salesSummaryError,
      render: () => {
        if (!salesSummaryData) return <EmptyState />;

        let totalSales = 0;
        let totalVat = 0;
        let totalOrders = 0;

        Object.entries(salesSummaryData.data).forEach(([_, data]) => {
          const salesData = data as {
            totalSales?: number;
            vat?: number;
            totalOrders?: number;
          };
          totalSales += salesData.totalSales || 0;
          totalVat += salesData.vat || 0;
          totalOrders += salesData.totalOrders || 0;
        });

        const monthlyData = Object.entries(salesSummaryData.data).map(
          ([month, data]) => {
            const salesData = data as {
              totalSales?: number;
              vat?: number;
              totalOrders?: number;
            };
            return (
              <div key={month} className="border-b py-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{month}</span>
                  <Badge variant="outline">
                    {salesData.totalOrders} orders
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Sales</p>
                    <p className="font-medium">
                      {formatCurrency(salesData.totalSales || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">VAT</p>
                    <p className="font-medium">
                      {formatCurrency(salesData.vat || 0)}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        );

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-indigo-50 p-3">
                <h4 className="text-xs font-medium text-indigo-900">
                  Total Sales
                </h4>
                <p className="text-xl font-bold text-indigo-700">
                  {formatCurrency(totalSales)}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <h4 className="text-xs font-medium text-blue-900">Total VAT</h4>
                <p className="text-xl font-bold text-blue-700">
                  {formatCurrency(totalVat)}
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <h4 className="text-xs font-medium text-purple-900">
                  Total Orders
                </h4>
                <p className="text-xl font-bold text-purple-700">
                  {totalOrders}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Monthly Breakdown</h4>
              <div className="max-h-60 overflow-y-auto rounded-md border p-2">
                {monthlyData}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "order-status",
      label: "Order Status",
      description: "Processing, shipped, and delivered orders",
      icon: <ShoppingCart className="h-6 w-6 text-orange-500" />,
      category: "sales",
      lastUpdated: "Today",
      isLoading: orderStatusLoading,
      error: orderStatusError,
      render: () => {
        if (!orderStatusData) return <EmptyState />;

        const totalOrders = Object.values(orderStatusData.data).reduce(
          (sum, count) => (sum as number) + (count as number),
          0
        );

        const statusItems = Object.entries(orderStatusData.data).map(
          ([status, count]) => {
            const percentage = Math.round(
              ((count as number) / (totalOrders as number)) * 100
            );

            return (
              <div key={status} className="mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{status}</span>
                  <span className="text-sm text-gray-500">
                    {count as number} ({percentage}%)
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          }
        );

        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-orange-50 p-4">
              <h4 className="text-sm font-medium text-orange-900">
                Total Orders
              </h4>
              <p className="text-2xl font-bold text-orange-700">
                {totalOrders as number}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Status Breakdown</h4>
              <div className="rounded-md border p-3">{statusItems}</div>
            </div>
          </div>
        );
      },
    },
    {
      id: "top-products",
      label: "Top Products",
      description: "Best selling and most viewed products",
      icon: <Package className="h-6 w-6 text-purple-500" />,
      category: "inventory",
      lastUpdated: "3 days ago",
      isLoading: topProductsLoading,
      error: topProductsError,
      render: () => {
        if (!topProductsData) return <EmptyState />;

        const allProducts: Record<string, number> = {};

        Object.entries(topProductsData.data).forEach(([_, products]) => {
          Object.entries(products as ProductCount).forEach(
            ([product, count]) => {
              if (!allProducts[product]) {
                allProducts[product] = 0;
              }
              allProducts[product] += count;
            }
          );
        });

        const topProducts = Object.entries(allProducts)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 5);

        const productItems = topProducts.map(([product, count], index) => (
          <div
            key={product}
            className="flex items-center justify-between border-b py-2"
          >
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-800">
                {index + 1}
              </div>
              <span className="ml-3 text-sm font-medium">{product}</span>
            </div>
            <Badge variant="secondary">{count} units</Badge>
          </div>
        ));

        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-purple-50 p-4">
              <h4 className="text-sm font-medium text-purple-900">
                Top Selling Products
              </h4>
              <p className="text-sm text-purple-700">
                Based on sales data from all periods
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto rounded-md border p-2">
              {productItems}
            </div>
          </div>
        );
      },
    },
    {
      id: "low-in-stock",
      label: "Low In Stock",
      description: "Products that need reordering soon",
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      category: "inventory",
      lastUpdated: "Today",
      isLoading: lowInStockLoading,
      error: lowInStockError,
      render: () => {
        if (!lowInStockData || lowInStockData.data.length === 0)
          return <EmptyState />;

        const criticalItems = lowInStockData.data.filter(
          (item: LowInStockItem) => item.quantity <= item.model.minimumStock
        ).length;

        const stockItems = lowInStockData.data.map((item: LowInStockItem) => {
          const isCritical = item.quantity <= item.model.minimumStock;

          return (
            <div key={item.id} className="border-b py-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.model.name}</span>
                <Badge variant={isCritical ? "destructive" : "outline"}>
                  {isCritical ? "Critical" : "Low"}
                </Badge>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Current: </span>
                  <span className="font-medium">{item.quantity}</span>
                </div>
                <div>
                  <span className="text-gray-500">Minimum: </span>
                  <span className="font-medium">{item.model.minimumStock}</span>
                </div>
              </div>
            </div>
          );
        });

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-red-50 p-4">
                <h4 className="text-sm font-medium text-red-900">
                  Critical Stock
                </h4>
                <p className="text-2xl font-bold text-red-700">
                  {criticalItems}
                </p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4">
                <h4 className="text-sm font-medium text-yellow-900">
                  Low Stock Items
                </h4>
                <p className="text-2xl font-bold text-yellow-700">
                  {lowInStockData.data.length}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Items Needing Attention</h4>
              <div className="max-h-60 overflow-y-auto rounded-md border p-2">
                {stockItems}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "wishlist-trends",
      label: "Wishlist Trends",
      description: "Most wishlisted products and conversion rates",
      icon: <Heart className="h-6 w-6 text-pink-500" />,
      category: "other",
      lastUpdated: "2 days ago",
      isLoading: wishlistsTrendsLoading,
      error: wishlistsTrendsError,
      render: () => {
        if (!wishlistsTrendsData) return <EmptyState />;

        const allProducts: Record<string, number> = {};

        Object.entries(wishlistsTrendsData.data).forEach(([_, products]) => {
          Object.entries(products as ProductCount).forEach(
            ([product, count]) => {
              if (!allProducts[product]) {
                allProducts[product] = 0;
              }
              allProducts[product] += count;
            }
          );
        });

        const topWishlisted = Object.entries(allProducts)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 5);

        const wishlistItems = topWishlisted.map(([product, count]) => (
          <div
            key={product}
            className="flex items-center justify-between border-b py-2"
          >
            <span className="text-sm font-medium">{product}</span>
            <div className="flex items-center">
              <Heart className="mr-1 h-4 w-4 text-pink-500" />
              <span className="text-sm">{count}</span>
            </div>
          </div>
        ));

        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-pink-50 p-4">
              <h4 className="text-sm font-medium text-pink-900">
                Most Wishlisted Products
              </h4>
              <p className="text-sm text-pink-700">
                Products users save for later purchase
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto rounded-md border p-2">
              {wishlistItems}
            </div>
          </div>
        );
      },
    },
    {
      id: "technician-registrations",
      label: "Technician Registration",
      description: "New technician onboarding and application status",
      icon: <FileText className="h-6 w-6 text-cyan-500" />,
      category: "users",
      lastUpdated: "Yesterday",
      isLoading: technicianRegistrationLoading,
      error: technicianRegistrationError,
      render: () => {
        if (!technicianRegistrationData) return <EmptyState />;

        const totalTechnicians = Object.values(
          technicianRegistrationData.data
        ).reduce((sum, count) => (sum as number) + (count as number), 0);

        const monthlyData = Object.entries(technicianRegistrationData.data).map(
          ([month, count]) => (
            <div
              key={month}
              className="flex items-center justify-between border-b py-2"
            >
              <span className="font-medium">{month}</span>
              <Badge variant="outline" className="bg-cyan-50">
                {count as number} technicians
              </Badge>
            </div>
          )
        );

        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-cyan-50 p-4">
              <h4 className="text-sm font-medium text-cyan-900">
                Total Technicians
              </h4>
              <p className="text-2xl font-bold text-cyan-700">
                {totalTechnicians as number}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Monthly Breakdown</h4>
              <div className="max-h-60 overflow-y-auto rounded-md border p-2">
                {monthlyData}
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const filteredReports = allReports.filter((report) => {
    const matchesSearch =
      report.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || report.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleReportClick = (reportId: string) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col space-y-6 p-1">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Heading
              title="Analytics Dashboard"
              description="Insights and metrics for your business"
            />
            <div className="mt-2 flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Last updated: Today</span>
              <span className="h-1 w-1 rounded-full bg-gray-300"></span>
              <span>{allReports.length} reports available</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </div>
        </div>
        <Separator />

        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-9 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Select
              value={categoryFilter}
              onValueChange={(value) =>
                setCategoryFilter(value as "all" | ReportItem["category"])
              }
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Reports
              </h3>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-bold">{allReports.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Updated Today
              </h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="mt-2 text-2xl font-bold">
              {allReports.filter((r) => r.lastUpdated === "Today").length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Sales Reports
              </h3>
              <ShoppingCart className="h-5 w-5 text-orange-500" />
            </div>
            <p className="mt-2 text-2xl font-bold">
              {allReports.filter((r) => r.category === "sales").length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Inventory Alerts
              </h3>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <p className="mt-2 text-2xl font-bold">
              {
                allReports.filter(
                  (r) => r.id === "low-in-stock" && !r.isLoading && !r.error
                ).length
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <Card
                key={report.id}
                className={`transition-all hover:shadow-md ${
                  expandedReport === report.id ? "border-primary" : ""
                }`}
              >
                <CardHeader
                  className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
                  onClick={() => handleReportClick(report.id)}
                >
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {report.label}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {report.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {report.icon}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReportClick(report.id);
                      }}
                    >
                      {expandedReport === report.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">
                      {report.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Updated {report.lastUpdated}
                    </span>
                  </div>

                  {expandedReport === report.id && (
                    <div className="mt-4 animate-in fade-in">
                      {report.isLoading ? (
                        <div className="flex h-40 items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : report.error ? (
                        <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-red-50/50 p-4">
                          <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                          <p className="text-center text-sm font-medium text-red-500">
                            Error loading data
                          </p>
                          <p className="text-center text-xs text-red-400 mt-1">
                            {report.error.message}
                          </p>
                        </div>
                      ) : (
                        report.render()
                      )}
                    </div>
                  )}
                </CardContent>
                {expandedReport === report.id && (
                  <CardFooter className="flex justify-end border-t pt-4">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))
          ) : (
            <div className="col-span-full flex h-60 flex-col items-center justify-center rounded-lg border border-dashed bg-gray-50/50 p-8">
              <Search className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No reports found</h3>
              <p className="mt-1 text-sm text-muted-foreground text-center max-w-md">
                No reports match your search criteria. Try adjusting your filters
                or search term.
              </p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}