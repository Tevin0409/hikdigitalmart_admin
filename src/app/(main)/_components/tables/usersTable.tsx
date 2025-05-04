import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SmartPagination from "@/components/ui/smartPagination";
import { useEffect, useState, memo } from "react";

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  phoneNumber: string | null;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  technicianVerified: boolean;
  shopOwnerVerified: boolean;
  createdAt: string;
  updatedAt: string;
  role: Role;
  permissions: any[];
}

interface UserTableProps {
  users: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
    results: User[];
  };
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearchTermChange: (search: string) => void;
  roles: Role[];
  selectedRoleId: string;
  onRoleChange: (roleId: string) => void;
  isLoading?: boolean;
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Memoized row component to prevent unnecessary re-renders
const UserRow = memo(({ user }: { user: User }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case "SUDO":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "TECHNICIAN":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "WHOLESALER":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "USER":
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle">
        <Checkbox />
      </td>
      <td className="p-4 align-middle font-medium">
        {user.firstName} {user.lastName}
      </td>
      <td className="p-4 align-middle">{user.email}</td>
      <td className="p-4 align-middle">{user.phoneNumber || "—"}</td>
      <td className="p-4 align-middle">
        <Badge className={getRoleBadgeColor(user.role.name)}>
          {user.role.name}
        </Badge>
      </td>
      <td className="p-4 align-middle flex gap-1">
        {user.isVerified ? (
          <Badge className="bg-green-100 text-green-800">Verified</Badge>
        ) : (
          <Badge variant="outline">Unverified</Badge>
        )}
        {user.technicianVerified && (
          <Badge className="bg-blue-100 text-blue-800">Tech</Badge>
        )}
        {user.shopOwnerVerified && (
          <Badge className="bg-yellow-100 text-yellow-800">Shop</Badge>
        )}
      </td>
      <td className="p-4 align-middle">{formatDate(user.createdAt)}</td>
    </tr>
  );
});

UserRow.displayName = "UserRow";

export default function UserTable({
  users,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchTermChange,
  roles,
  selectedRoleId,
  onRoleChange,
  isLoading = false,
}: UserTableProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500);

  useEffect(() => {
    onSearchTermChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchTermChange]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or phone..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-background"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedRoleId} onValueChange={onRoleChange}>
            <SelectTrigger className="w-[180px] rounded-lg bg-background">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border transition-opacity duration-300">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          </div>
        ) : (
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12">
                    <Checkbox />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Phone
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Role
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {users.results.length === 0 ? (
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td colSpan={7} className="p-4 align-middle h-24 text-center">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.results.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {users.totalResults} {users.totalResults === 1 ? 'user' : 'users'} total
        </div>
        {totalPages > 1 && (
          <SmartPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            activeClassName="bg-blue-500 text-white hover:bg-blue-600"
            prevLabel="Prev"
            nextLabel="Next"
            delta={1}
          />
        )}
      </div>

    </div>
  );
}