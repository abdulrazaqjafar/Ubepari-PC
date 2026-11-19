"use client";

import Image from "next/image";
import {
  Heart,
  MessageCircle,
  ShoppingCart,
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
  Trash2,
} from "lucide-react";
import type { Product, StockStatus } from "@/types/product";
import { buildWhatsAppLink, formatTZS } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  isSaved: boolean;
  isInCart: boolean;
  onToggleSave: (id: string) => void;
  onToggleCart: (id: string) => void;
  onCycleStatus?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

const STOCK_STYLES: Record<StockStatus, string> = {
  "IN STOCK": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "LIMITED STOCK": "border-amber-200 bg-amber-50 text-amber-700",
  "SOLD OUT": "border-rose-200 bg-rose-50 text-rose-700",
  "PRE-ORDER": "border-cyan-200 bg-cyan-50 text-cyan-700",
};

export default function ProductCard({
  product,
  isSaved,
  isInCart,
  onToggleSave,
  onToggleCart,
  onCycleStatus,
  onDelete,
}: ProductCardProps) {
  const whatsappUrl = buildWhatsAppLink(product);
  const specs = [
    { icon: Cpu, label: product.cpu },
    { icon: MemoryStick, label: product.ram },
    { icon: HardDrive, label: product.storage },
    ...(product.gpu ? [{ icon: Monitor, label: product.gpu }] : []),
  ];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-600/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200/70">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent"
        />

        <div className="absolute left-3 top-3 z-10 flex max-w-[70%] flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onCycleStatus?.(product)}
            title={onCycleStatus ? "Click to change status" : undefined}
            className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${STOCK_STYLES[product.stock]} ${
              onCycleStatus ? "cursor-pointer hover:brightness-95" : "cursor-default"
            }`}
          >
            {product.stock}
          </button>
          <span className="rounded-md border border-slate-200 bg-white/95 px-2 py-0.5 text-[10px] font-medium text-slate-600 shadow-sm">
            {product.condition}
          </span>
        </div>

        <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(product.id)}
              aria-label="Delete product"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-500 shadow-sm transition hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4 shrink-0" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onToggleSave(product.id)}
            aria-label={isSaved ? "Remove from saved" : "Save item"}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-sm transition ${
              isSaved
                ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                : "border-slate-200 bg-white text-slate-500 hover:text-slate-900"
            }`}
          >
            <Heart className={`h-4 w-4 shrink-0 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-700">
              {product.brand}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[10px] text-slate-500">{product.category}</span>
          </div>

          <h3 className="text-base font-semibold leading-snug text-slate-900 sm:text-lg">
            {product.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {specs.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] leading-none text-slate-700"
            >
              <Icon
                className="h-3.5 w-3.5 shrink-0 text-slate-500"
                aria-hidden
              />
              <span className="truncate">{label}</span>
            </span>
          ))}
        </div>

        <div className="mt-auto space-y-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Bei
            </p>
            <p className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {formatTZS(product.price)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleCart(product.id)}
              aria-label={isInCart ? "Remove from cart" : "Add to cart"}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
                isInCart
                  ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              <ShoppingCart className="h-4 w-4 shrink-0" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-3.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/25 transition hover:from-emerald-400 hover:to-emerald-500"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
