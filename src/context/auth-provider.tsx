"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { refreshAccessToken } from "@/actions/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const { accessToken, setAccessToken } = useAuthStore();

  useEffect(() => {
    async function refreshToken() {
      try {
        const token = await refreshAccessToken();
        setAccessToken(token);
      } catch {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    }

    if (!accessToken) {
      refreshToken();
    } else {
      setLoading(false);
    }
  }, [accessToken, setAccessToken]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
