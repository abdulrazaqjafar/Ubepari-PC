"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { adminCreateLaptop, adminUpdateLaptop } from "@/actions/admin";
import type { Brand, Category, Product, StockStatus } from "@/types/product";

const BRANDS: Brand[] = ["HP", "Dell", "Lenovo", "Apple", "Asus", "Acer"];
const CATEGORIES: Category[] = [
  "Gaming",
  "Coding & Heavy Work",
  "Office & Business",
  "Budget",
];
const STOCK: StockStatus[] = [
  "IN STOCK",
  "LIMITED STOCK",
  "SOLD OUT",
  "PRE-ORDER",
];

interface NewLaptopFormProps {
  initial?: Product | null;
}

export default function NewLaptopForm({ initial = null }: NewLaptopFormProps) {
  const router = useRouter();
  const isEdit = !!initial;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>(
    initial?.images?.length
      ? initial.images
      : initial?.image
        ? [initial.image]
        : [""]
  );

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    brand: (initial?.brand ?? "HP") as Brand,
    category: (initial?.category ?? "Office & Business") as Category,
    price: initial ? String(initial.price) : "",
    cpu: initial?.cpu ?? "Core i5 12th Gen",
    ram: initial?.ram ?? "16GB RAM",
    storage: initial?.storage ?? "512GB NVMe SSD",
    gpu: initial?.gpu ?? "",
    stock: (initial?.stock ?? "IN STOCK") as StockStatus,
    condition: (initial?.condition ?? "Brand New") as "Brand New" | "Pre-owned",
    description: initial?.description ?? "",
  });

  const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const price = Number(form.price.replace(/,/g, ""));
    const cleanedImages = images.map((url) => url.trim()).filter(Boolean);

    if (!form.name.trim()) {
      setError("Laptop name is required.");
      return;
    }
    if (!price || price < 100_000) {
      setError("Enter a valid TZS price (min 100,000).");
      return;
    }
    if (cleanedImages.length === 0) {
      setError("Add at least one image URL.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      brand: form.brand,
      category: form.category,
      price,
      cpu: form.cpu,
      ram: form.ram,
      storage: form.storage,
      gpu: form.gpu || undefined,
      image: cleanedImages[0],
      images: cleanedImages,
      stock: form.stock,
      condition: form.condition,
      description: form.description || undefined,
    };

    startTransition(async () => {
      const result = isEdit
        ? await adminUpdateLaptop(initial!.id, payload)
        : await adminCreateLaptop(payload);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-6"
    >
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          Laptop Name *
        </label>
        <input
          className={fieldClass}
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="HP EliteBook 840 G8"
          required
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Brand
          </label>
          <select
            className={fieldClass}
            value={form.brand}
            onChange={(e) =>
              setForm((p) => ({ ...p, brand: e.target.value as Brand }))
            }
          >
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
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
              setForm((p) => ({
                ...p,
                category: e.target.value as Category,
              }))
            }
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
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
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            placeholder="1850000"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Stock Status
          </label>
          <select
            className={fieldClass}
            value={form.stock}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                stock: e.target.value as StockStatus,
              }))
            }
          >
            {STOCK.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            CPU
          </label>
          <input
            className={fieldClass}
            value={form.cpu}
            onChange={(e) => setForm((p) => ({ ...p, cpu: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            RAM
          </label>
          <input
            className={fieldClass}
            value={form.ram}
            onChange={(e) => setForm((p) => ({ ...p, ram: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Storage
          </label>
          <input
            className={fieldClass}
            value={form.storage}
            onChange={(e) =>
              setForm((p) => ({ ...p, storage: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            GPU (optional)
          </label>
          <input
            className={fieldClass}
            value={form.gpu}
            onChange={(e) => setForm((p) => ({ ...p, gpu: e.target.value }))}
            placeholder="RTX 3060 6GB"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          Condition
        </label>
        <select
          className={fieldClass}
          value={form.condition}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              condition: e.target.value as "Brand New" | "Pre-owned",
            }))
          }
        >
          <option value="Brand New">Brand New</option>
          <option value="Pre-owned">Pre-owned</option>
        </select>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-medium text-slate-600">
            Image URLs *
          </label>
          <button
            type="button"
            onClick={() => setImages((prev) => [...prev, ""])}
            className="inline-flex items-center gap-1 text-xs font-medium text-cyan-700 hover:text-cyan-800"
          >
            <Plus className="h-3.5 w-3.5" />
            Add image
          </button>
        </div>
        <div className="space-y-2">
          {images.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                className={fieldClass}
                value={url}
                onChange={(e) =>
                  setImages((prev) =>
                    prev.map((item, i) =>
                      i === index ? e.target.value : item
                    )
                  )
                }
                placeholder="/uploads/laptops/jina-la-laptop.jpg"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 text-rose-700 hover:bg-rose-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          Description
        </label>
        <textarea
          className={`${fieldClass} min-h-24`}
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Short sales description…"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-600/20 disabled:opacity-60"
      >
        {isPending
          ? "Saving…"
          : isEdit
            ? "Update Laptop"
            : "Publish Laptop"}
      </button>
    </form>
  );
}
