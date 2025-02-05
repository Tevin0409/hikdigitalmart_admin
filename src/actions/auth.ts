// actions/auth.ts
"use server";

import { cookies } from "next/headers";

export async function loginAction(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // Ensure cookies are stored
  });

  if (!res.ok) throw new Error("Invalid credentials");

  const { accessToken, refreshToken } = await res.json();

  // Store the refresh token in an HttpOnly cookie
  cookies().set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return accessToken;
}
export async function refreshAccessToken() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to refresh token");

  const { accessToken } = await res.json();
  return accessToken;
}

export async function logoutAction() {
  cookies().delete("refresh_token");
}
