"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { MessageCircle, ShieldCheck, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import Logo from "@/components/Logo";
import { PRICE_MAX, WHATSAPP_NUMBER } from "@/data/products";
import { getLaptops } from "@/actions/laptops";
import type { FilterState, Product } from "@/types/product";

const DEFAULT_FILTERS: FilterState = {
  brand: "All",
  category: "All",
  maxPrice: PRICE_MAX,
  sort: "newest",
  search: "",
  page: 1,
  pageSize: 24,
};

interface CatalogAppProps {
  initialProducts?: Product[];
  initialTotal?: number;
}

export default function CatalogApp({
  initialProducts = [],
  initialTotal = 0,
}: CatalogAppProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [cartIds, setCartIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const skipFirstFetch = useRef(true);

  const loadLaptops = useCallback((nextFilters: FilterState) => {
    startTransition(async () => {
      const result = await getLaptops(nextFilters);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setError("");
      setProducts(result.data.items);
      setTotal(result.data.total);
    });
  }, []);

  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }
    loadLaptops(filters);
  }, [filters, loadLaptops]);

  const updateFilters = (next: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...next,
      page: next.page ?? 1,
    }));
  };

  const toggleInSet = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar cartCount={cartIds.size} savedCount={savedIds.size} />

      <main className="flex-1">
        <Hero
          search={filters.search}
          onSearchChange={(search) => updateFilters({ search })}
          resultCount={total}
        />

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          {error && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <FilterSidebar
              filters={filters}
              onChange={updateFilters}
              onReset={() =>
                setFilters((prev) => ({
                  ...DEFAULT_FILTERS,
                  search: prev.search,
                }))
              }
              resultCount={total}
            />

            <div className={isPending ? "opacity-60 transition" : "transition"}>
              <ProductGrid
                products={products}
                savedIds={savedIds}
                cartIds={cartIds}
                onToggleSave={(id) => toggleInSet(setSavedIds, id)}
                onToggleCart={(id) => toggleInSet(setCartIds, id)}
              />
            </div>
          </div>
        </section>

        <section
          id="about"
          className="border-t border-slate-200 bg-gradient-to-b from-white to-cyan-50/40"
        >
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:px-8">
            {[
              {
                icon: ShieldCheck,
                title: "Quality Checked",
                text: "Kila laptop inapimwa specs, battery na display kabla ya kuuzwa.",
              },
              {
                icon: MessageCircle,
                title: "Order via WhatsApp",
                text: "Bofya Order kwenye card — ujumbe wa inquiry unajaza moja kwa moja.",
              },
              {
                icon: Truck,
                title: "Delivery · DSM",
                text: "Tunapeleka ndani ya Dar es Salaam haraka, au unaweza kuchukua mwenyewe.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Logo variant="nav" />
            <p className="text-sm text-slate-500">
              Laptop za nguvu · Bei ya ubepari · Dar es Salaam
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Habari Ubepari PC! Nina maswali kuhusu laptops zenu.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}
