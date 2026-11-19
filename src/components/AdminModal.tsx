"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import type {
  Brand,
  Category,
  CreateLaptopInput,
  NewProductForm,
  Product,
  StockStatus,
} from "@/types/product";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: CreateLaptopInput) => Promise<Product>;
}

const BRANDS: Brand[] = ["HP", "Dell", "Lenovo", "Apple", "Asus", "Acer"];
const CATEGORIES: Category[] = [
  "Gaming",
  "Coding & Heavy Work",
  "Office & Business",
  "Budget",
];
const STOCK_OPTIONS: StockStatus[] = [
  "IN STOCK",
  "LIMITED STOCK",
  "SOLD OUT",
  "PRE-ORDER",
];

const EMPTY_FORM: NewProductForm = {
  name: "",
  brand: "HP",
  category: "Office & Business",
  price: "",
  ram: "16GB RAM",
  storage: "512GB NVMe SSD",
  cpu: "Core i5 12th Gen",
  gpu: "",
  image:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
  stock: "IN STOCK",
  condition: "Brand New",
};

export default function AdminModal({ open, onClose, onAdd }: AdminModalProps) {
  const titleId = useId();
  const [form, setForm] = useState<NewProductForm>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const update = <K extends keyof NewProductForm>(
    key: K,
    value: NewProductForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const price = Number(form.price.replace(/,/g, ""));
    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!price || price < 100_000) {
      setError("Enter a valid price (min TZS 100,000).");
      return;
    }

    const payload: CreateLaptopInput = {
      name: form.name.trim(),
      brand: form.brand,
      category: form.category,
      price,
      ram: form.ram.trim() || "8GB RAM",
      storage: form.storage.trim() || "256GB SSD",
      cpu: form.cpu.trim() || "Core i5",
      gpu: form.gpu.trim() || undefined,
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
      stock: form.stock,
      condition: form.condition ?? "Brand New",
      description: "Added via Admin Demo modal.",
    };

    startTransition(async () => {
      try {
        await onAdd(payload);
        setForm(EMPTY_FORM);
        onClose();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Imeshindikana kuongeza laptop."
        );
      }
    });
  };

  const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        aria-label="Close modal"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 sm:rounded-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-md">
          <div>
            <h2 id={titleId} className="text-base font-semibold text-slate-900">
              Add New Product
            </h2>
            <p className="text-xs text-slate-500">
              Admin demo — saves to PostgreSQL via Prisma
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Laptop Name *
            </label>
            <input
              className={fieldClass}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. HP ProBook 450 G9"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Brand
              </label>
              <select
                className={fieldClass}
                value={form.brand}
                onChange={(e) => update("brand", e.target.value as Brand)}
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Category
              </label>
              <select
                className={fieldClass}
                value={form.category}
                onChange={(e) =>
                  update("category", e.target.value as Category)
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Price (TZS) *
            </label>
            <input
              className={fieldClass}
              type="number"
              min={100000}
              step={10000}
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="1850000"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                RAM
              </label>
              <input
                className={fieldClass}
                value={form.ram}
                onChange={(e) => update("ram", e.target.value)}
                placeholder="16GB RAM"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Storage
              </label>
              <input
                className={fieldClass}
                value={form.storage}
                onChange={(e) => update("storage", e.target.value)}
                placeholder="512GB NVMe SSD"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                CPU
              </label>
              <input
                className={fieldClass}
                value={form.cpu}
                onChange={(e) => update("cpu", e.target.value)}
                placeholder="Core i7 11th Gen"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                GPU (optional)
              </label>
              <input
                className={fieldClass}
                value={form.gpu}
                onChange={(e) => update("gpu", e.target.value)}
                placeholder="RTX 3060 6GB"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Image URL
            </label>
            <input
              className={fieldClass}
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              placeholder="https://…"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Stock Status
            </label>
            <select
              className={fieldClass}
              value={form.stock}
              onChange={(e) => update("stock", e.target.value as StockStatus)}
            >
              {STOCK_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-600/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {isPending ? "Saving…" : "Add to Catalog"}
          </button>
        </form>
      </div>
    </div>
  );
}
