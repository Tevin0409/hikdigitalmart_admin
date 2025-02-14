import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession, decrypt } from "@/lib/session";
import { refreshAccessToken } from "./app/(auth)/actions";
import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard"];
// const publicRoutes = ["/login", "/signup", "/"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  // const isPublicRoute = publicRoutes.includes(path);

  // Get cookies
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const accessToken = cookieStore.get("access_token")?.value;

  // Decrypt session
  const session = await decrypt(sessionCookie);
  console.log("sessionn", session);

  const isSessionExpired =
    (session as SessionPayload).expiresAt &&
    new Date((session as SessionPayload).expiresAt) < new Date();

  if (isProtectedRoute && (!session?.userId || !accessToken)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Refresh token if session is expired and refreshToken exists
  if (isSessionExpired && refreshToken) {
    console.log("isSessionExpired", isSessionExpired);
    console.log("refreshToken", refreshToken);
    try {
      const result = await refreshAccessToken();

      if (result.data as LoginResponse) {
        const {
          accessToken,
          refreshToken,
          refreshTokenExpiresAt,
          accessTokenExpiresAt,
        } = result.data as LoginResponse;
        // Store new access token in cookies
        cookieStore.set("access_token", accessToken, {
          secure: true,
          sameSite: "strict",
          path: "/",
          expires: new Date(accessTokenExpiresAt),
        });
        cookieStore.set("refresh_token", refreshToken as string, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
          expires: new Date(refreshTokenExpiresAt),
        });

        // Update session with new expiration
        await updateSession();
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect dashboard routes
};
