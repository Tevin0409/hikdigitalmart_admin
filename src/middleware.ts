import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession, decrypt } from "@/lib/session";
import { refreshAccessToken } from "./app/(auth)/actions";

const protectedRoutes = ["/dashboard"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  // Get cookies from request
  const sessionCookie = req.cookies.get("session")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const accessToken = req.cookies.get("access_token")?.value;

  // Decrypt session
  const session = await decrypt(sessionCookie);
  console.log("Session:", session);

  const isSessionExpired =
    (session as SessionPayload)?.expiresAt &&
    new Date((session as SessionPayload).expiresAt) < new Date();

  if (isProtectedRoute && (!session?.userId || !accessToken)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Handle session refresh
  if (isSessionExpired && refreshToken) {
    console.log("Session expired, refreshing token...");
    try {
      const result = await refreshAccessToken();
      if (result.data as LoginResponse) {
        const {
          accessToken,
          refreshToken,
          refreshTokenExpiresAt,
          accessTokenExpiresAt,
        } = result.data as LoginResponse;

        // Use NextResponse to modify cookies
        const response = NextResponse.next();
        response.cookies.set("access_token", accessToken, {
          secure: true,
          sameSite: "strict",
          path: "/",
          expires: new Date(accessTokenExpiresAt),
        });
        response.cookies.set("refresh_token", refreshToken as string, {
          secure: true,
          sameSite: "strict",
          path: "/",
          expires: new Date(refreshTokenExpiresAt),
        });

        // Update session
        await updateSession();
        return response;
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Ensure compatibility with Vercel Edge Functions
export const config = {
  matcher: ["/dashboard/:path*"],
  runtime: "experimental-edge",
};
