"use client";

import PageContainer from "@/components/layout/page-container";

// import { useAuthStore } from "@/store/authStore";

// import { useRouter } from "next/navigation";

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
      </div>
    </PageContainer>
  );
}
