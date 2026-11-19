"use client";

import { Filter, RotateCcw, SlidersHorizontal } from "lucide-react";
import type { Brand, Category, FilterState, SortOption } from "@/types/product";
import { PRICE_MAX } from "@/data/products";
import { formatTZS } from "@/lib/utils";

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (next: Partial<FilterState>) => void;
  onReset: () => void;
  resultCount: number;
}

const BRANDS: Array<Brand | "All"> = [
  "All",
  "HP",
  "Dell",
  "Lenovo",
  "Apple",
];

const CATEGORIES: Array<Category | "All"> = [
  "All",
  "Gaming",
  "Coding & Heavy Work",
  "Office & Business",
  "Budget",
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
        active
          ? "border-cyan-600/40 bg-cyan-50 text-cyan-800 shadow-sm shadow-cyan-600/10"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

export default function FilterSidebar({
  filters,
  onChange,
  onReset,
  resultCount,
}: FilterSidebarProps) {
  return (
    <aside
      id="filters"
      className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 lg:sticky lg:top-24"
    >
      <div className="mb-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-900">
          <SlidersHorizontal className="h-4 w-4 text-cyan-600" />
          <h2 className="text-sm font-semibold tracking-wide">Filters</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <p className="mb-5 flex items-center gap-1.5 text-xs text-slate-500">
        <Filter className="h-3 w-3" />
        Showing{" "}
        <span className="font-medium text-cyan-700">{resultCount}</span>{" "}
        laptop{resultCount !== 1 ? "s" : ""}
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="mb-2.5 text-xs font-medium uppercase tracking-wider text-slate-500">
            Brand
          </h3>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((brand) => (
              <Chip
                key={brand}
                active={filters.brand === brand}
                onClick={() => onChange({ brand })}
              >
                {brand}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2.5 text-xs font-medium uppercase tracking-wider text-slate-500">
            Use Case
          </h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Chip
                key={category}
                active={filters.category === category}
                onClick={() => onChange({ category })}
              >
                {category}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Max Price
            </h3>
            <span className="text-xs font-medium text-emerald-700">
              {formatTZS(filters.maxPrice)}
            </span>
          </div>
          <input
            type="range"
            min={500_000}
            max={PRICE_MAX}
            step={50_000}
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
            className="w-full cursor-pointer accent-cyan-600"
            aria-label="Maximum price"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-400">
            <span>TZS 500K</span>
            <span>TZS 4.5M</span>
          </div>
        </div>

        <div>
          <h3 className="mb-2.5 text-xs font-medium uppercase tracking-wider text-slate-500">
            Sort By
          </h3>
          <select
            value={filters.sort}
            onChange={(e) =>
              onChange({ sort: e.target.value as SortOption })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
