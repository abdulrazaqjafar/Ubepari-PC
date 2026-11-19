import { Suspense } from "react";
import { connection } from "next/server";
import CatalogApp from "@/components/CatalogApp";
import { getLaptops } from "@/actions/laptops";
import { PRICE_MAX } from "@/data/products";

// Catalog reads the database at request time.
export const instant = false;

function CatalogFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
        <p className="mt-4 text-sm text-slate-500">Inapakia catalog…</p>
      </div>
    </div>
  );
}

async function HomeCatalog() {
  await connection();
  const result = await getLaptops({
    brand: "All",
    category: "All",
    maxPrice: PRICE_MAX,
    sort: "newest",
    search: "",
    page: 1,
    pageSize: 24,
  });

  return (
    <CatalogApp
      initialProducts={result.ok ? result.data.items : []}
      initialTotal={result.ok ? result.data.total : 0}
    />
  );
}

export default function Home() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <HomeCatalog />
    </Suspense>
  );
}
