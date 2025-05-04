"use client";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus, RefreshCw, Download } from "lucide-react";
import { useState } from "react";
import { useUsers, useUsersRoles } from "@/hooks/use-users";
import { NewProductModal2 } from "../../_components/newProduct";
import UserTable from "../../_components/tables/usersTable";

const Users = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("ALL"); // "ALL" by default
  const limit = 10;
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data, isLoading, error, refetch } = useUsers({
    page,
    limit,
    searchTerm,
    roleId: selectedRoleId !== "ALL" ? selectedRoleId : undefined,
    refreshTrigger, // Add this to trigger refetch when changed
  });

  const {
    data: roles,
    isLoading: rolesIsLoading,
    error: roleErrorLoading,
  } = useUsersRoles();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // Increment to trigger refetch
    refetch(); // Use refetch function from React Query
  };

  const handleExport = () => {
    if (!data?.data) return;

    const usersData = data.data as PaginatedUsers;
    const exportData = usersData.results.map((user) => ({
      id: user.id,
      name: `${user.firstName}  ${user.lastName}`,
      email: user.email,
      role: user.role?.name || "No Role",
      createdAt: new Date(user.createdAt).toLocaleDateString(),
      // Add other fields you want to export
    }));

    // Convert to CSV
    const headers = Object.keys(exportData[0]).join(",");
    const rows = exportData.map((user) => Object.values(user).join(","));
    const csv = [headers, ...rows].join("\n");

    // Create download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <p>Loading users...</p>;
  if (error || !data?.data)
    return <p>Error fetching Users or no data available</p>;

  const defaultUsersData: PaginatedUsers = {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
    results: [],
  };
  const usersData = (data?.data as PaginatedUsers) ?? defaultUsersData;

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Users" description="Manage users" />

          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={usersData.results.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            <NewProductModal2
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
            />
          </div>
        </div>
        <Separator />
        <UserTable
          users={usersData}
          currentPage={page}
          totalPages={usersData.totalPages}
          onPageChange={setPage}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          roles={(roles?.data as Roles[]) ?? []}
          selectedRoleId={selectedRoleId}
          onRoleChange={(roleId) => {
            setSelectedRoleId(roleId);
            setPage(1); // Reset page when changing role
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Users;
