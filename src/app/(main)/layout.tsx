import type { Metadata } from "next";
// import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Admin Dashboard | Hik Digital Mart",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  //   const cookieStore = cookies();
  //   const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  return (
    <div>
      {/* page main content */}
      {children}
      {/* page main content ends */}
    </div>
  );
}
