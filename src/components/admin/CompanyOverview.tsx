import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Package,
  Users,
  Wallet,
} from "lucide-react";
import type { CompanyInsights } from "@/actions/company";
import { formatTZS } from "@/lib/utils";

interface CompanyOverviewProps {
  insights: CompanyInsights;
  ownerName?: string | null;
}

export default function CompanyOverview({
  insights,
  ownerName,
}: CompanyOverviewProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Company Overview
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
              Habari{ownerName ? `, ${ownerName.split(" ")[0]}` : ""} — Ubepari PC
            </h2>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Muhtasari wa biashara: thamani ya stock, engagement ya wateja,
              timu, na vitu vinavyohitaji attention.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/reports"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Full Reports
            </Link>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Users className="h-3.5 w-3.5" />
              Team
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Thamani ya Stock",
              value: formatTZS(insights.inventoryValue),
              hint: `${insights.activeListings} active listings`,
              icon: Wallet,
            },
            {
              label: "Avg. Bei (Active)",
              value: formatTZS(insights.avgPrice),
              hint: `${insights.brandNewCount} brand new · ${insights.preOwnedCount} pre-owned`,
              icon: Package,
            },
            {
              label: "Customer Engagement",
              value: `${insights.engagementRate}%`,
              hint: `${insights.totalViews} views · ${insights.totalClicks} clicks`,
              icon: ArrowUpRight,
            },
            {
              label: "Timu ya Staff",
              value: String(insights.staff.active),
              hint: `${insights.staff.clerks} clerks · ${insights.staff.owners} owners`,
              icon: Users,
            },
          ].map(({ label, value, hint, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  {label}
                </p>
                <Icon className="h-4 w-4 text-cyan-700" />
              </div>
              <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{hint}</p>
            </div>
          ))}
        </div>
      </div>

      {insights.needsAttention.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-900">
            <AlertTriangle className="h-4 w-4" />
            Inahitaji attention ({insights.needsAttention.length})
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {insights.needsAttention.map((item) => (
              <Link
                key={item.id}
                href={`/admin/laptops/new?edit=${item.id}`}
                className="rounded-xl border border-amber-200/80 bg-white px-3 py-2.5 text-sm transition hover:border-amber-300"
              >
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">
                  {item.stock} · {formatTZS(item.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-sm font-semibold text-slate-900">
            Top Viewed Laptops
          </h3>
          <ul className="mt-3 space-y-2">
            {insights.topViewed.map((item, index) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="min-w-0 truncate text-slate-700">
                  <span className="mr-2 text-xs text-slate-400">
                    #{index + 1}
                  </span>
                  {item.name}
                </span>
                <span className="shrink-0 font-medium text-slate-900">
                  {item.viewCount ?? 0} views
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-sm font-semibold text-slate-900">
            Stock by Brand
          </h3>
          <ul className="mt-3 space-y-2">
            {insights.byBrand.slice(0, 6).map((row) => (
              <li
                key={row.brand}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-slate-700">
                  {row.brand}{" "}
                  <span className="text-xs text-slate-400">
                    ({row.count})
                  </span>
                </span>
                <span className="shrink-0 font-medium text-slate-900">
                  {formatTZS(row.value)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
