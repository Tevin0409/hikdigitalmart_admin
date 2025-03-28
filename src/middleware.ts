import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession, decrypt } from "@/lib/session";
import { refreshAccessToken } from "./app/(auth)/actions";

const protectedRoutes = ["/dashboard", "/dashboard/"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const sessionCookie = req.cookies.get("session")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const accessToken = req.cookies.get("access_token")?.value;

  let session;
  try {
    session = await decrypt(sessionCookie);
  } catch (error) {
    console.error("Decrypt error:", error);
  }

  const isSessionExpired =
    (session as SessionPayload)?.expiresAt &&
    new Date((session as SessionPayload).expiresAt) < new Date();

  if (isProtectedRoute && (!session?.userId || !accessToken)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isSessionExpired && refreshToken) {
    try {
      const result = await refreshAccessToken();

      if (result.data as LoginResponse) {
        const {
          accessToken,
          refreshToken,
          refreshTokenExpiresAt,
          accessTokenExpiresAt,
        } = result.data as LoginResponse;

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

        await updateSession();
        return response;
      } else {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
