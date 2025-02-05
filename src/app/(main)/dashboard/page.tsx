"use client";

import { useAuthStore } from "@/store/authStore";
import { logoutAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { setAccessToken } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    setAccessToken(null);
    router.push("/login");
  };

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
