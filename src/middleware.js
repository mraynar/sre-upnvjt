import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req, event) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const authMiddleware = withAuth({
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  });

  return authMiddleware(req, event);
}

export const config = {
  // Only routes that REQUIRE authentication are listed here.
  // Public routes (/articles, /about, /merchandise, etc.) must NOT appear here.
  matcher: [
    "/dashboard/:path*",
    "/roles/:path*",
    "/users/:path*",
    "/departments/:path*",
    "/merch/:path*",
    "/settings/:path*",
    // Previously unprotected — now fixed
    "/content/:path*",
    "/forms/:path*",
    "/partners/:path*",
    // New operational modules
    "/literature/:path*",
    "/ppt/:path*",
    "/quiz/:path*",
    "/tasks/:path*",
    "/leaderboard/:path*",
    "/attendance/:path*",
    "/events-admin/:path*",
    "/member/:path*",
  ],
};

