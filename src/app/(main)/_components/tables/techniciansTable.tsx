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

interface TechnicianRowProps {
  technician: TechnicianQuestionnaire;
  onApprove: (id: string) => void;
  onViewDetails: (technician: TechnicianQuestionnaire) => void;
}

interface TechnicianDetailProps {
  technician: TechnicianQuestionnaire;
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

// Technician Detail Component for the Side Drawer
const TechnicianDetail = ({ technician, onClose }: TechnicianDetailProps) => {
  if (!technician) return null;

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
              {getInitials(technician.user.firstName, technician.user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {technician.user.firstName} {technician.user.lastName}
              {technician.user.technicianVerified && (
                <Verified className="h-5 w-5 text-blue-500" />
              )}
            </h3>
            <p className="text-muted-foreground flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {technician.businessName}
            </p>
          </div>
        </div>
        <div>
          {technician.user.technicianVerified ? (
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
          <TabsTrigger value="experience">Experience</TabsTrigger>
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
                  Email
                </div>
                <p className="font-medium">{technician.email}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Phone
                </div>
                <p className="font-medium">{technician.phoneNumber || "—"}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  User Phone
                </div>
                <p className="font-medium">{technician.user.phoneNumber}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Location
                </div>
                <p className="font-medium">{technician.location}</p>
              </div>
            </div>
          </div>

          {/* Business Card */}
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
                <p className="font-medium">{technician.businessType || "—"}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Experience (Years)
                </div>
                <p className="font-medium">
                  {technician.experienceYears || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Integration Experience
                </div>
                <p className="font-medium">
                  {technician.integrationExperience}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Familiar With Standard
                </div>
                <p className="font-medium">
                  {technician.familiarWithStandard || "No"}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          {/* Purchase & Training Card */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold tracking-tight mb-3 flex items-center gap-2">
              Purchase & Training
            </h4>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Purchase Hikvision
                </div>
                <p className="font-medium">{technician.purchaseHikvision}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Requires Training
                </div>
                <p className="font-medium">{technician.requiresTraining}</p>
              </div>
              <div className="col-span-1 md:col-span-2 space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Purchase Sources
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {technician.purchaseSource &&
                  technician.purchaseSource.length > 0 ? (
                    technician.purchaseSource.map((source, index) => (
                      <Badge key={index} variant="secondary">
                        {source}
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

          {/* Experience & Brands Card */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold tracking-tight mb-3 flex items-center gap-2">
              Experience & Brands
            </h4>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Experience Areas
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {technician.experienceAreas &&
                  technician.experienceAreas.length > 0 ? (
                    technician.experienceAreas.map((area, index) => (
                      <Badge key={index} variant="secondary">
                        {area}
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
                  Brands Worked With
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {technician.brandsWorkedWith &&
                  technician.brandsWorkedWith.length > 0 ? (
                    technician.brandsWorkedWith.map((brand, index) => (
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
                  {technician.user.isVerified ? "Yes" : "No"}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Shop Owner Verified
                </div>
                <p className="font-medium">
                  {technician.user.shopOwnerVerified ? "Yes" : "No"}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created
                </div>
                <p className="font-medium">
                  {formatDate(technician.createdAt)}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Updated
                </div>
                <p className="font-medium">
                  {formatDate(technician.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Memoized row component to prevent unnecessary re-renders
const TechnicianRow = memo(
  ({ technician, onApprove, onViewDetails }: TechnicianRowProps) => {
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
        onClick={() => onViewDetails(technician)}
      >
        <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
          {/* <Checkbox /> */}
        </TableCell>
        <TableCell className="font-medium">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-white text-xs">
                {getInitials(
                  technician.user.firstName,
                  technician.user.lastName
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {technician.user.firstName} {technician.user.lastName}
              </div>
              <div className="text-xs text-muted-foreground">
                {technician.businessName}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>{technician.email}</TableCell>
        <TableCell>{technician.phoneNumber || "—"}</TableCell>
        <TableCell className="max-w-[150px] truncate">
          {technician.location}
        </TableCell>
        <TableCell>
          {technician.experienceYears || technician.businessType || "—"}
        </TableCell>
        <TableCell>
          <div className="flex gap-1 flex-wrap">
            {technician.user.technicianVerified ? (
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
        <TableCell>{formatDate(technician.createdAt)}</TableCell>
        <TableCell className="w-28">
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(technician);
              }}
              className="h-8 w-8 p-0"
              size="sm"
              variant="outline"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {!technician.user.technicianVerified && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(technician.user.id);
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

TechnicianRow.displayName = "TechnicianRow";

const TechnicianTable = ({
  data,
  currentPage = 1,
  onPageChange,
  searchTerm = "",
  onSearchTermChange,
  onApprove,
  isLoading = false,
}: TechnicianTableProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const debouncedSearchTerm = useDebounce<string>(localSearchTerm, 500);
  const [selectedTechnician, setSelectedTechnician] =
    useState<TechnicianQuestionnaire | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    if (onSearchTermChange) {
      onSearchTermChange(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearchTermChange]);

  const handleViewDetails = (technician: TechnicianQuestionnaire): void => {
    setSelectedTechnician(technician);
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
              placeholder="Search technicians by name, business, or location..."
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
                <TableHead className="w-12">
                  {/* <Checkbox /> */}
                </TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No technicians found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                data.results.map((technician) => (
                  <TechnicianRow
                    key={technician.id}
                    technician={technician}
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
          {data.totalResults === 1 ? "technician" : "technicians"}
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

      {/* Modern Side Drawer for Technician Details */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl p-0 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-background border-b p-6">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle className="text-2xl">
                    Technician Details
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
            {selectedTechnician ? (
              <TechnicianDetail
                technician={selectedTechnician}
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
              {selectedTechnician &&
                !selectedTechnician.user.technicianVerified && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white px-6"
                    onClick={() => {
                      handleApprove(selectedTechnician.user.id);
                      setIsDrawerOpen(false);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Technician
                  </Button>
                )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TechnicianTable;
