"use client";

import { PackageSearch } from "lucide-react";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  savedIds: Set<string>;
  cartIds: Set<string>;
  onToggleSave: (id: string) => void;
  onToggleCart: (id: string) => void;
  onCycleStatus?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export default function ProductGrid({
  products,
  savedIds,
  cartIds,
  onToggleSave,
  onToggleCart,
  onCycleStatus,
  onDelete,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div
        id="catalog"
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center"
      >
        <PackageSearch className="mb-4 h-12 w-12 shrink-0 text-slate-300" />
        <h3 className="text-lg font-semibold text-slate-800">
          Hakuna laptop zilizopatikana
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Jaribu kubadilisha filters au search query yako ili kuona zaidi.
        </p>
      </div>
    );
  }

  return (
    <div
      id="catalog"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3"
    >
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-in h-full"
          style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
        >
          <ProductCard
            product={product}
            isSaved={savedIds.has(product.id)}
            isInCart={cartIds.has(product.id)}
            onToggleSave={onToggleSave}
            onToggleCart={onToggleCart}
            onCycleStatus={onCycleStatus}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
