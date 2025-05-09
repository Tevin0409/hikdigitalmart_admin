import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  Eye,
  Search,
  X,
  ChevronRight,
  Clock,
  Verified,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  User,
  Shield,
  Store,
  Package,
  ShieldCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SmartPagination from "@/components/ui/smartPagination";
import { useEffect, useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShopOwnerRowProps {
  shopOwner: ShopOwner;
  onApprove: (id: string) => void;
  onViewDetails: (shopOwner: ShopOwner) => void;
}

interface ShopOwnerDetailProps {
  shopOwner: ShopOwner;
  onClose?: () => void;
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ShopOwner Detail Component for the Side Drawer
const ShopOwnerDetail = ({ shopOwner, onClose }: ShopOwnerDetailProps) => {
  if (!shopOwner) return null;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-white font-medium">
              {getInitials(shopOwner.firstName, shopOwner.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {shopOwner.firstName} {shopOwner.lastName}
              {shopOwner.user && shopOwner.user.shopOwnerVerified && (
                <Verified className="h-5 w-5 text-blue-500" />
              )}
            </h3>
            <p className="text-muted-foreground flex items-center gap-1">
              <Store className="h-4 w-4" />
              {shopOwner.companyName}
            </p>
          </div>
        </div>
        <div>
          {shopOwner.user && shopOwner.user.shopOwnerVerified ? (
            <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Approved
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm flex items-center gap-1"
            >
              <Clock className="h-3 w-3" />
              Pending
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs for better organization */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Contact Card */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold tracking-tight mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </h4>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Primary Email
                </div>
                <p className="font-medium">{shopOwner.email}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Secondary Email
                </div>
                <p className="font-medium">{shopOwner.email2 || "—"}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Primary Phone
                </div>
                <p className="font-medium">{shopOwner.phoneNumber}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Secondary Phone
                </div>
                <p className="font-medium">{shopOwner.phoneNumber2 || "—"}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Address
                </div>
                <p className="font-medium">{shopOwner.address}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          {/* Business Details Card */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold tracking-tight mb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Business Details
            </h4>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Business Type
                </div>
                <p className="font-medium">
                  {shopOwner.selectedBusinessType || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Brands & Categories Card */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold tracking-tight mb-3 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Brands & Categories
            </h4>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Selected Brands
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {shopOwner.selectedBrands &&
                  shopOwner.selectedBrands.length > 0 ? (
                    shopOwner.selectedBrands.map((brand, index) => (
                      <Badge key={index} variant="secondary">
                        {brand}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      None specified
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Security Brands
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {shopOwner.selectedSecurityBrands &&
                  shopOwner.selectedSecurityBrands.length > 0 ? (
                    shopOwner.selectedSecurityBrands.map((brand, index) => (
                      <Badge key={index} variant="secondary">
                        {brand}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      None specified
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Other Brand
                </div>
                <p className="font-medium">{shopOwner.otherBrand || "—"}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Product Categories
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {shopOwner.selectedCategories &&
                  shopOwner.selectedCategories.length > 0 ? (
                    shopOwner.selectedCategories.map((category, index) => (
                      <Badge key={index} variant="secondary">
                        {category}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      None specified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold tracking-tight mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Additional Information
            </h4>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Hikvision Challenges
                </div>
                <p className="font-medium">
                  {shopOwner.hikvisionChallenges || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Advice to Secure Digital
                </div>
                <p className="font-medium">
                  {shopOwner.adviceToSecureDigital || "—"}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          {/* Account Information Card */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold tracking-tight mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Information
            </h4>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Account Verified
                </div>
                <p className="font-medium">
                  {shopOwner.user && shopOwner.user.isVerified ? "Yes" : "No"}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Technician Verified
                </div>
                <p className="font-medium">
                  {shopOwner.user && shopOwner.user.technicianVerified
                    ? "Yes"
                    : "No"}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created
                </div>
                <p className="font-medium">{formatDate(shopOwner.createdAt)}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Updated
                </div>
                <p className="font-medium">{formatDate(shopOwner.updatedAt)}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Memoized row component to prevent unnecessary re-renders
const ShopOwnerRow = memo(
  ({ shopOwner, onApprove, onViewDetails }: ShopOwnerRowProps) => {
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getInitials = (firstName: string, lastName: string) => {
      return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    };

    return (
      <TableRow
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => onViewDetails(shopOwner)}
      >
        <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
          {/* <Checkbox /> */}
        </TableCell>
        <TableCell className="font-medium">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-white text-xs">
                {getInitials(shopOwner.firstName, shopOwner.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {shopOwner.firstName} {shopOwner.lastName}
              </div>
              <div className="text-xs text-muted-foreground">
                {shopOwner.companyName}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>{shopOwner.email}</TableCell>
        <TableCell>{shopOwner.phoneNumber}</TableCell>
        <TableCell className="max-w-[150px] truncate">
          {shopOwner.address}
        </TableCell>
        <TableCell>{shopOwner.selectedBusinessType || "—"}</TableCell>
        <TableCell>
          <div className="flex gap-1 flex-wrap">
            {shopOwner.user && shopOwner.user.shopOwnerVerified ? (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Approved
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Pending
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell>{formatDate(shopOwner.createdAt)}</TableCell>
        <TableCell className="w-28">
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(shopOwner);
              }}
              className="h-8 w-8 p-0"
              size="sm"
              variant="outline"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {shopOwner.user && !shopOwner.user.shopOwnerVerified && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(shopOwner?.user?.id ? shopOwner.user.id : "");
                }}
                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  }
);

ShopOwnerRow.displayName = "ShopOwnerRow";

const ShopOwnersTable = ({
  data,
  currentPage = 1,
  onPageChange,
  searchTerm = "",
  onSearchTermChange,
  onApprove,
  isLoading = false,
}: ShopOwnersTableProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const debouncedSearchTerm = useDebounce<string>(localSearchTerm, 500);
  const [selectedShopOwner, setSelectedShopOwner] = useState<ShopOwner | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    if (onSearchTermChange) {
      onSearchTermChange(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearchTermChange]);

  const handleViewDetails = (shopOwner: ShopOwner): void => {
    setSelectedShopOwner(shopOwner);
    setIsDrawerOpen(true);
  };

  const handleApprove = (id: string): void => {
    if (onApprove) {
      onApprove(id);
    }
  };

  const handleStatusFilterChange = (value: string): void => {
    setStatusFilter(value);
  };

  if (!data) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shop owners by name, company, or address..."
              value={localSearchTerm || ""}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            defaultValue="ALL"
            value={statusFilter}
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border bg-background shadow-sm">
        {isLoading ? (
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-12">{/* <Checkbox /> */}</TableHead>
                <TableHead>Shop Owner</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No shop owners found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                data.results.map((shopOwner) => (
                  <ShopOwnerRow
                    key={shopOwner.id}
                    shopOwner={shopOwner}
                    onApprove={handleApprove}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination and Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {data.results.length} of {data.totalResults}{" "}
          {data.totalResults === 1 ? "shop owner" : "shop owners"}
        </div>
        {data.totalPages > 1 && (
          <SmartPagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={onPageChange}
            activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
            prevLabel="Previous"
            nextLabel="Next"
            delta={1}
            className="rounded-md"
          />
        )}
      </div>

      {/* Modern Side Drawer for ShopOwner Details */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl p-0 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-background border-b p-6">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle className="text-2xl">
                    Shop Owner Details
                  </SheetTitle>
                  <SheetDescription>
                    Complete profile information and verification status
                  </SheetDescription>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>
          </div>

          <div className="p-6">
            {selectedShopOwner ? (
              <ShopOwnerDetail
                shopOwner={selectedShopOwner}
                onClose={() => setIsDrawerOpen(false)}
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 z-10 bg-background border-t p-4">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
                className="px-6"
              >
                Close
              </Button>
              {selectedShopOwner &&
                selectedShopOwner.user &&
                !selectedShopOwner.user.shopOwnerVerified && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white px-6"
                    onClick={() => {
                      handleApprove(
                        selectedShopOwner?.user?.id
                          ? selectedShopOwner.user.id
                          : ""
                      );
                      setIsDrawerOpen(false);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Shop Owner
                  </Button>
                )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ShopOwnersTable;
