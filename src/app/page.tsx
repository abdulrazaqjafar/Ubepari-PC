import CatalogApp from "@/components/CatalogApp";
import { getLaptops } from "@/actions/laptops";
import { PRICE_MAX } from "@/data/products";

export default async function Home() {
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
