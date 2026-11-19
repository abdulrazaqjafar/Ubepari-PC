"use client";

import Link from "next/link";
import { Heart, Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";

interface NavbarProps {
  cartCount: number;
  savedCount: number;
}

const NAV_LINKS = [
  { href: "#catalog", label: "Catalog" },
  { href: "#filters", label: "Filters" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ cartCount, savedCount }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        <a
          href="#"
          className="group flex shrink-0 items-center transition hover:opacity-90"
          aria-label="Ubepari PC Home"
        >
          <Logo variant="nav" priority />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/login"
            className="hidden items-center gap-1.5 rounded-lg border border-cyan-600/25 bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-800 transition hover:bg-cyan-100 sm:inline-flex"
          >
            Staff
          </Link>

          <button
            type="button"
            aria-label="Saved items"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Heart className="h-5 w-5 shrink-0" strokeWidth={2} />
            {savedCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label="Cart"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ShoppingCart className="h-5 w-5 shrink-0" strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 shrink-0" strokeWidth={2} />
            ) : (
              <Menu className="h-5 w-5 shrink-0" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="mt-1 rounded-lg border border-cyan-600/25 bg-cyan-50 px-3 py-2.5 text-left text-sm font-medium text-cyan-800"
            >
              Staff
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
