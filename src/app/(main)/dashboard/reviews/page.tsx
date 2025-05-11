"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import ReviewTable from "../../_components/tables/ReviewsTable";
import { RespondToReview } from "../../actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useReviews } from "@/hooks/use-reports";

const Reviews = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [pendingResponse, setPendingResponse] = useState<{
    reviewId: string;
    message: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResponding, setIsResponding] = useState(false);

  const { data, isLoading, error, refetch } = useReviews({
    page,
    limit,
    searchTerm,
    refreshTrigger,
  });

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    refetch();
  };

  const handleRespondToReview = async (reviewId: string, message: string) => {
    setPendingResponse({ reviewId, message });
    setIsDialogOpen(true);
  };

  const handleConfirmResponse = async () => {
    if (!pendingResponse) return;
    
    setIsResponding(true);
    try {
      const { success,message } = await RespondToReview(
        pendingResponse.reviewId, 
        pendingResponse.message
      );
      
      if (success) {
        toast.success("Response submitted successfully");
        refetch();
      } else {
        toast.error(message || "Failed to submit response");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Error responding to review:", err);
    } finally {
      setIsResponding(false);
      setIsDialogOpen(false);
      setPendingResponse(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

  if (error) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-500">Error fetching reviews</p>
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

  const reviews = data?.data || defaultData;

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Reviews"
            description="Manage reviews"
          />

          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        <Separator />

        <ReviewTable
          data={reviews}
          currentPage={page}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          isLoading={isLoading}
          onRespondToReview={handleRespondToReview}
        />

        {/* Response Confirmation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Response</DialogTitle>
              <DialogDescription>
                Are you sure you want to send this response?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="font-medium">Response Preview:</p>
              <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {pendingResponse?.message}
              </p>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isResponding}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmResponse}
                disabled={isResponding}
              >
                {isResponding ? "Sending..." : "Confirm Send"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
};

export default Reviews;