import { Suspense } from "react";
import { connection } from "next/server";
import CatalogApp from "@/components/CatalogApp";
import { getLaptops } from "@/actions/laptops";
import { PRICE_MAX } from "@/data/products";

export default function Home() {
  return (
    <Suspense fallback={<CatalogApp />}>
      <LaptopCatalog />
    </Suspense>
  );
}

async function LaptopCatalog() {
  // Laptop data comes from the database, so read it per request rather than
  // at build time (when no database connection is available).
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
