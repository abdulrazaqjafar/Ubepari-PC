import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/auth.config";
import { isAdminConfigured } from "@/lib/setup-status";

const authMiddleware = NextAuth(authConfig).auth;

export default function middleware(req: NextRequest, ctx: unknown) {
  // Until DATABASE_URL and AUTH_SECRET are set, Auth.js cannot run. Send all
  // admin routes to the login page, which explains what needs configuring.
  if (!isAdminConfigured()) {
    if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (authMiddleware as any)(req, ctx);
}

export const config = {
  matcher: ["/admin/:path*"],
};
