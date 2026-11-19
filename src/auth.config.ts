import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      if (pathname.startsWith("/admin/login")) {
        // Allow login page always after logout; only bounce away when
        // already authenticated and not mid-sign-out.
        if (isLoggedIn && !request.nextUrl.searchParams.has("signedout")) {
          return Response.redirect(
            new URL("/admin/dashboard", request.nextUrl)
          );
        }
        return true;
      }

      if (!pathname.startsWith("/admin")) {
        return true;
      }

      if (!isLoggedIn) {
        return false;
      }

      if (
        pathname.startsWith("/admin/users") ||
        pathname.startsWith("/admin/reports")
      ) {
        if (role === "SUPER_ADMIN" || role === "OWNER") return true;
        return Response.redirect(
          new URL("/admin/dashboard", request.nextUrl)
        );
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
