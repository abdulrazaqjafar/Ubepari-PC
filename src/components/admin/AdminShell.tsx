"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  PlusCircle,
  Users,
} from "lucide-react";
import { roleLabel } from "@/lib/rbac";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/admin/LogoutButton";
import type { Role } from "@prisma/client";

interface AdminShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    role: Role;
  };
}

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin/reports",
    label: "Reports",
    icon: BarChart3,
    roles: ["SUPER_ADMIN", "OWNER"] as Role[],
  },
  { href: "/admin/laptops/new", label: "Add Laptop", icon: PlusCircle },
  {
    href: "/admin/users",
    label: "Team",
    icon: Users,
    roles: ["SUPER_ADMIN", "OWNER"] as Role[],
  },
];

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-3"
            aria-label="Ubepari PC Admin"
          >
            <Logo variant="nav" className="h-11 w-auto sm:h-12" />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                Ubepari PC
              </p>
              <p className="text-[11px] font-medium text-cyan-700">
                Staff Portal
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-slate-800">{user.name}</p>
              <p className="text-[11px] text-slate-500">
                {roleLabel(user.role)}
              </p>
            </div>
            <Link
              href="/"
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Storefront
            </Link>
            <LogoutButton className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-60" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-0 lg:gap-6 lg:px-6 lg:py-6">
        <aside className="hidden w-64 shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 lg:flex">
          <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-4 text-center">
            <Link
              href="/admin/dashboard"
              className="inline-flex justify-center"
              aria-label="Ubepari PC"
            >
              <Logo variant="nav" className="h-16 w-auto" />
            </Link>
            <p className="mt-3 text-sm font-semibold text-slate-900">
              Ubepari PC
            </p>
            <p className="mt-0.5 text-xs text-cyan-700">Staff Portal</p>
            <p className="mt-2 text-[11px] text-slate-500">
              {user.name} · {roleLabel(user.role)}
            </p>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {NAV.filter(
              (item) => !item.roles || item.roles.includes(user.role)
            ).map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-cyan-50 font-medium text-cyan-800"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <LogoutButton
            showIcon
            className="mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-60"
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
            {NAV.filter(
              (item) => !item.roles || item.roles.includes(user.role)
            ).map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    active
                      ? "bg-cyan-50 text-cyan-800"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-0 lg:py-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
