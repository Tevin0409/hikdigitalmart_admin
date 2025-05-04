"use client";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useUsers, useUsersRoles } from "@/hooks/use-users";
import { NewProductModal2 } from "../../_components/newProduct";
import UserTable from "../../_components/tables/usersTable";

const Users = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("ALL"); // "ALL" by default
  const limit = 10;

  const { data, isLoading, error } = useUsers({
    page,
    limit,
    searchTerm,
    roleId: selectedRoleId !== "ALL" ? selectedRoleId : undefined,
  });

  const {
    data: roles,
    isLoading: rolesIsLoading,
    error: roleErrorLoading,
  } = useUsersRoles();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
