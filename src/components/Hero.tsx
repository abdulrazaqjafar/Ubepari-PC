"use client";

import { MapPin, Search, Sparkles, Zap } from "lucide-react";
import Logo from "@/components/Logo";

interface HeroProps {
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

export default function Hero({
  search,
  onSearchChange,
  resultCount,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(8,145,178,0.12), transparent), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(5,150,105,0.08), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <Logo variant="full" priority />
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <MapPin className="h-3.5 w-3.5" />
            Dar es Salaam · Pre-owned & Brand New
          </div>

          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            Pata Laptop za{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              Nguvu na Kazi
            </span>{" "}
            kwa Bei ya Ubepari
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-slate-600 sm:text-lg">
            Quality pre-owned & brand-new laptops — tested, warrantied, and
            ready for gaming, coding, na biashara katika Dar es Salaam.
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <label htmlFor="hero-search" className="sr-only">
              Search laptops
            </label>
            <div className="group relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-cyan-600" />
              <input
                id="hero-search"
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tafuta brand, CPU, RAM, au model…"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-lg shadow-slate-200/60 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 sm:text-base"
              />
            </div>
            {search && (
              <p className="mt-2 text-sm text-slate-500">
                {resultCount} result{resultCount !== 1 ? "s" : ""} for “
                {search}”
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 sm:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
              <Zap className="h-3.5 w-3.5 text-cyan-600" />
              Tested Specs
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              WhatsApp Ordering
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
              Fast Delivery · DSM
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
