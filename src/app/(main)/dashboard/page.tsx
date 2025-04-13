"use client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PageContainer from "@/components/layout/page-container";
import DashboardSummary from "../_components/DashboardSummary";

function DashboardSummarySkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                  <div className="h-10 w-28 bg-gray-200 animate-pulse rounded mt-3" />
                </div>
                <div className="h-12 w-12 bg-gray-200 animate-pulse rounded-full" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const stored_user = localStorage.getItem("user");

  const user = JSON.parse(stored_user!);

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi {user?.firstName}, Welcome back 👋
          </h2>
        </div>
        <Suspense fallback={<DashboardSummarySkeleton />}>
          <DashboardSummary />
        </Suspense>
      </div>
    </PageContainer>
  );
}
