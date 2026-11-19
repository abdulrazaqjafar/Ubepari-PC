import Link from "next/link";
import type { CompanyInsights } from "@/actions/company";
import { formatTZS } from "@/lib/utils";

interface ReportsClientProps {
  insights: CompanyInsights;
}

export default function ReportsClient({ insights }: ReportsClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Company Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Uchambuzi wa stock, brands, categories, na performance ya catalog
          </p>
        </div>
        <Link
          href="/admin/dashboard"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Back to dashboard
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Listings",
            value: insights.totalListings,
          },
          {
            label: "Active Stock Value",
            value: formatTZS(insights.inventoryValue),
          },
          {
            label: "Sold Out Value",
            value: formatTZS(insights.soldOutValue),
          },
          {
            label: "Click-through",
            value: `${insights.engagementRate}%`,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs uppercase tracking-wider text-slate-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Performance by Brand
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-3">Brand</th>
                  <th className="py-2 pr-3">Units</th>
                  <th className="py-2 pr-3">Value</th>
                  <th className="py-2">Views / Clicks</th>
                </tr>
              </thead>
              <tbody>
                {insights.byBrand.map((row) => (
                  <tr key={row.brand} className="border-b border-slate-100">
                    <td className="py-2.5 pr-3 font-medium text-slate-900">
                      {row.brand}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">{row.count}</td>
                    <td className="py-2.5 pr-3 text-slate-800">
                      {formatTZS(row.value)}
                    </td>
                    <td className="py-2.5 text-slate-600">
                      {row.views} / {row.clicks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Mix by Category
          </h2>
          <ul className="mt-4 space-y-3">
            {insights.byCategory.map((row) => {
              const pct =
                insights.totalListings > 0
                  ? Math.round((row.count / insights.totalListings) * 100)
                  : 0;
              return (
                <li key={row.category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-800">
                      {row.category}
                    </span>
                    <span className="text-slate-500">
                      {row.count} · {formatTZS(row.value)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Most Viewed
          </h2>
          <ul className="mt-3 space-y-2">
            {insights.topViewed.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 text-sm last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.brand} · {item.stock}
                  </p>
                </div>
                <span className="shrink-0 font-semibold text-cyan-800">
                  {item.viewCount ?? 0}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Most Clicked (WhatsApp interest)
          </h2>
          <ul className="mt-3 space-y-2">
            {insights.topClicked.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 text-sm last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatTZS(item.price)}
                  </p>
                </div>
                <span className="shrink-0 font-semibold text-emerald-700">
                  {item.clickCount ?? 0}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Staff Snapshot</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total accounts", value: insights.staff.total },
            { label: "Active", value: insights.staff.active },
            { label: "Sales clerks", value: insights.staff.clerks },
            { label: "Owners", value: insights.staff.owners },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Stock status: {insights.activeListings} active ·{" "}
          {insights.limitedCount} limited · {insights.preOrderCount} pre-order ·{" "}
          {insights.soldOutCount} sold out
        </p>
      </section>
    </div>
  );
}
