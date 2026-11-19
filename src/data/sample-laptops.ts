import type {
  FilterState,
  LaptopListResult,
  Product,
} from "@/types/product";

/**
 * SAMPLE DATA — shown only while DATABASE_URL is not configured.
 * Mirrors prisma/seed.ts so the public catalog has something to display.
 * Once DATABASE_URL is set, real laptops from Postgres are used instead.
 */
export const SAMPLE_LAPTOPS: Product[] = [
  {
    id: "sample-hp-elitebook",
    name: "HP EliteBook 840 G8",
    brand: "HP",
    category: "Office & Business",
    price: 1_850_000,
    cpu: "Core i7 11th Gen",
    ram: "16GB RAM",
    storage: "512GB NVMe SSD",
    image: "/uploads/laptops/hp-elitebook-1.jpg",
    images: ["/uploads/laptops/hp-elitebook-1.jpg", "/uploads/laptops/hp-elitebook-2.jpg"],
    stock: "IN STOCK",
    condition: "Pre-owned",
    description: "Business ultrabook yenye keyboard comfy na battery ya muda mrefu.",
    createdAt: "2026-10-12T00:00:00.000Z",
  },
  {
    id: "sample-dell-xps",
    name: "Dell XPS 13 9310",
    brand: "Dell",
    category: "Coding & Heavy Work",
    price: 2_450_000,
    cpu: "Core i7 11th Gen",
    ram: "16GB RAM",
    storage: "512GB NVMe SSD",
    image: "/uploads/laptops/dell-xps-1.jpg",
    images: ["/uploads/laptops/dell-xps-1.jpg", "/uploads/laptops/dell-xps-2.jpg"],
    stock: "LIMITED STOCK",
    condition: "Pre-owned",
    description: "InfinityEdge display — bora kwa developers na designers.",
    createdAt: "2026-10-28T00:00:00.000Z",
  },
  {
    id: "sample-thinkpad",
    name: "Lenovo ThinkPad T14 Gen 2",
    brand: "Lenovo",
    category: "Office & Business",
    price: 1_650_000,
    cpu: "Ryzen 5 Pro 5650U",
    ram: "16GB RAM",
    storage: "256GB NVMe SSD",
    image: "/uploads/laptops/thinkpad-1.jpg",
    images: ["/uploads/laptops/thinkpad-1.jpg", "/uploads/laptops/thinkpad-2.jpg"],
    stock: "IN STOCK",
    condition: "Pre-owned",
    description: "Classic ThinkPad build quality — durable na reliable.",
    createdAt: "2026-09-20T00:00:00.000Z",
  },
  {
    id: "sample-macbook",
    name: 'Apple MacBook Pro 14" M1 Pro',
    brand: "Apple",
    category: "Coding & Heavy Work",
    price: 3_850_000,
    cpu: "Apple M1 Pro",
    ram: "16GB Unified",
    storage: "512GB SSD",
    gpu: "14-core GPU",
    image: "/uploads/laptops/macbook-1.jpg",
    images: ["/uploads/laptops/macbook-1.jpg", "/uploads/laptops/macbook-2.jpg"],
    stock: "LIMITED STOCK",
    condition: "Pre-owned",
    description: "Powerhouse ya creative work na silent performance.",
    createdAt: "2026-11-02T00:00:00.000Z",
  },
  {
    id: "sample-hp-victus",
    name: "HP Victus 15 Gaming",
    brand: "HP",
    category: "Gaming",
    price: 2_150_000,
    cpu: "Core i5 12th Gen",
    ram: "16GB RAM",
    storage: "512GB NVMe SSD",
    gpu: "RTX 3050 4GB",
    image: "/uploads/laptops/victus-1.jpg",
    images: ["/uploads/laptops/victus-1.jpg", "/uploads/laptops/victus-2.jpg"],
    stock: "IN STOCK",
    condition: "Brand New",
    description: "Gaming laptop kwa bei nafuu — 144Hz display.",
    createdAt: "2026-11-10T00:00:00.000Z",
  },
];

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** Applies catalog filters to the sample data, matching getLaptops() semantics. */
export function filterSampleLaptops(
  filters: Partial<FilterState>,
  page: number,
  pageSize: number
): LaptopListResult {
  const q = filters.search?.trim().toLowerCase();
  let items = SAMPLE_LAPTOPS.filter((p) => p.stock !== "SOLD OUT");

  if (q) {
    items = items.filter((p) =>
      [p.name, p.brand, p.cpu, p.ram, p.storage, p.gpu, p.description]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    );
  }
  if (filters.brand && filters.brand !== "All") {
    items = items.filter((p) => p.brand === filters.brand);
  }
  if (filters.category && filters.category !== "All") {
    items = items.filter((p) => p.category === filters.category);
  }
  if (typeof filters.maxPrice === "number" && filters.maxPrice > 0) {
    items = items.filter((p) => p.price <= filters.maxPrice!);
  }

  items = [...items].sort((a, b) => {
    if (filters.sort === "price-asc") return a.price - b.price;
    if (filters.sort === "price-desc") return b.price - a.price;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const total = items.length;
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
