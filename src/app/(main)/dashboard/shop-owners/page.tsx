"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import { useGetAllShopOwnersQuestionnaires } from "@/hooks/use-users";
import ShopOwnersTable from "../../_components/tables/shopOwnersTable";
import { approveShopOwners } from "../../actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShopOwner = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, error, refetch } = useGetAllShopOwnersQuestionnaires(
    {
      page,
      limit,
      searchTerm,
      refreshTrigger,
    }
  );

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    refetch();
  };

  const handleApproveClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedUserId) return;
    
    setIsDialogOpen(false);
    const { success, message } = await approveShopOwners(selectedUserId);
    if (success) {
      toast.success("Shop Owner approved successfully");
      refetch();
    } else {
      toast.error(message);
    }
    setSelectedUserId(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page when searching
  };

  // if (isLoading) {
  //   return;
  // }

  if (error) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-500">Error fetching technicians</p>
            <Button onClick={handleRefresh} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const defaultData = {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
    results: [],
  };

  const technicianData = data?.data || defaultData;

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Shop Owners"
            description="Manage Shop Owners applications"
          />

          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        <Separator />

        <ShopOwnersTable
          data={technicianData}
          currentPage={page}
          onPageChange={setPage}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          onApprove={handleApproveClick}
          isLoading={isLoading}
        />

        {/* Approval Confirmation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Approval</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this shop owner? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmApprove}>
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
};

export default ShopOwner;