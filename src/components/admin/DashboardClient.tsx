"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Activity,
  Eye,
  MousePointerClick,
  PackageCheck,
  PackageX,
  Plus,
  Trash2,
} from "lucide-react";
import {
  adminDeleteLaptop,
  adminUpdateLaptopStatus,
  getAdminLaptops,
} from "@/actions/admin";
import type { Product, StockStatus } from "@/types/product";
import { formatTZS } from "@/lib/utils";

interface DashboardClientProps {
  stats: {
    totalActive: number;
    soldOut: number;
    totalViews: number;
    totalClicks: number;
    limited: number;
  };
  initialLaptops: Product[];
  canDelete: boolean;
  title?: string;
  subtitle?: string;
}

const STATUS_OPTIONS: Array<StockStatus | "ALL"> = [
  "ALL",
  "IN STOCK",
  "LIMITED STOCK",
  "SOLD OUT",
  "PRE-ORDER",
];

const fieldClass =
  "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20";

export default function DashboardClient({
  stats,
  initialLaptops,
  canDelete,
  title = "Dashboard",
  subtitle = "Inventory overview & laptop management",
}: DashboardClientProps) {
  const [laptops, setLaptops] = useState(initialLaptops);
  const [search, setSearch] = useState("");
  const [stock, setStock] = useState<StockStatus | "ALL">("ALL");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredLocal = useMemo(() => {
    return laptops.filter((laptop) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        laptop.name.toLowerCase().includes(q) ||
        laptop.brand.toLowerCase().includes(q) ||
        laptop.cpu.toLowerCase().includes(q);
      const matchesStock = stock === "ALL" || laptop.stock === stock;
      return matchesSearch && matchesStock;
    });
  }, [laptops, search, stock]);

  const refresh = () => {
    startTransition(async () => {
      const result = await getAdminLaptops({
        search,
        stock,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setError("");
      setLaptops(result.data);
    });
  };

  const onStatusChange = (id: string, next: StockStatus) => {
    startTransition(async () => {
      const result = await adminUpdateLaptopStatus(id, next);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setLaptops((prev) =>
        prev.map((item) => (item.id === id ? result.data : item))
      );
    });
  };

  const onDelete = (id: string) => {
    if (!canDelete) return;
    if (!window.confirm("Futa laptop hii?")) return;

    startTransition(async () => {
      const result = await adminDeleteLaptop(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setLaptops((prev) => prev.filter((item) => item.id !== id));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <Link
          href="/admin/laptops/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-600/20"
        >
          <Plus className="h-4 w-4" />
          Add Laptop
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Active Laptops",
            value: stats.totalActive,
            icon: PackageCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Sold Out",
            value: stats.soldOut,
            icon: PackageX,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
          {
            label: "Total Views",
            value: stats.totalViews,
            icon: Eye,
            color: "text-cyan-700",
            bg: "bg-cyan-50",
          },
          {
            label: "Total Clicks",
            value: stats.totalClicks,
            icon: MousePointerClick,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                {label}
              </p>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${bg} ${color}`}
              >
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Activity className="h-4 w-4 text-cyan-700" />
            Laptop Management
            {isPending && (
              <span className="text-xs font-normal text-slate-400">
                Updating…
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={refresh}
              placeholder="Search name, brand, CPU…"
              className={fieldClass}
            />
            <select
              value={stock}
              onChange={(e) => {
                setStock(e.target.value as StockStatus | "ALL");
                startTransition(async () => {
                  const result = await getAdminLaptops({
                    search,
                    stock: e.target.value as StockStatus | "ALL",
                  });
                  if (result.ok) setLaptops(result.data);
                });
              }}
              className={fieldClass}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3 py-3 font-medium">Laptop</th>
                <th className="px-3 py-3 font-medium">Price</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Views</th>
                <th className="px-3 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocal.map((laptop) => (
                <tr
                  key={laptop.id}
                  className="border-b border-slate-100 text-slate-600"
                >
                  <td className="px-3 py-3">
                    <p className="font-medium text-slate-900">{laptop.name}</p>
                    <p className="text-xs text-slate-500">
                      {laptop.brand} · {laptop.cpu}
                    </p>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-800">
                    {formatTZS(laptop.price)}
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={laptop.stock}
                      onChange={(e) =>
                        onStatusChange(
                          laptop.id,
                          e.target.value as StockStatus
                        )
                      }
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-cyan-400"
                    >
                      {(
                        [
                          "IN STOCK",
                          "LIMITED STOCK",
                          "SOLD OUT",
                          "PRE-ORDER",
                        ] as StockStatus[]
                      ).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">{laptop.viewCount ?? 0}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/laptops/new?edit=${laptop.id}`}
                        className="rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-xs font-medium text-cyan-800 hover:bg-cyan-100"
                      >
                        Edit
                      </Link>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(laptop.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLocal.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-10 text-center text-sm text-slate-400"
                  >
                    Hakuna laptops zilizopatikana.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
