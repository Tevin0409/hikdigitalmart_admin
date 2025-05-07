"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import { useGetAllTechnicianQuestionnaires } from "@/hooks/use-users";
import TechnicianTable from "../../_components/tables/technician";

const Technician = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data, isLoading, error, refetch } = useGetAllTechnicianQuestionnaires(
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

  const handleApprove = async (technicianId: number) => {};

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page when searching
  };

  if (isLoading) {
    return;
  }

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
            title="Technicians"
            description="Manage technician applications"
          />

          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        <Separator />

        <TechnicianTable
          data={technicianData}
          currentPage={page}
          onPageChange={setPage}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          onApprove={handleApprove}
          isLoading={isLoading}
        />
      </div>
    </PageContainer>
  );
};

export default Technician;
