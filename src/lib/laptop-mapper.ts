import type {
  Brand as PrismaBrand,
  Category as PrismaCategory,
  Condition as PrismaCondition,
  Laptop,
  StockStatus as PrismaStockStatus,
} from "@prisma/client";
import type {
  Brand,
  Category,
  CreateLaptopInput,
  Product,
  StockStatus,
} from "@/types/product";

const CATEGORY_TO_PRISMA: Record<Category, PrismaCategory> = {
  Gaming: "Gaming",
  "Coding & Heavy Work": "CodingHeavyWork",
  "Office & Business": "OfficeBusiness",
  Budget: "Budget",
};

const CATEGORY_FROM_PRISMA: Record<PrismaCategory, Category> = {
  Gaming: "Gaming",
  CodingHeavyWork: "Coding & Heavy Work",
  OfficeBusiness: "Office & Business",
  Budget: "Budget",
};

const STOCK_TO_PRISMA: Record<StockStatus, PrismaStockStatus> = {
  "IN STOCK": "IN_STOCK",
  "LIMITED STOCK": "LIMITED_STOCK",
  "SOLD OUT": "SOLD_OUT",
  "PRE-ORDER": "PRE_ORDER",
};

const STOCK_FROM_PRISMA: Record<PrismaStockStatus, StockStatus> = {
  IN_STOCK: "IN STOCK",
  LIMITED_STOCK: "LIMITED STOCK",
  SOLD_OUT: "SOLD OUT",
  PRE_ORDER: "PRE-ORDER",
};

const CONDITION_TO_PRISMA: Record<"Brand New" | "Pre-owned", PrismaCondition> =
  {
    "Brand New": "BrandNew",
    "Pre-owned": "PreOwned",
  };

const CONDITION_FROM_PRISMA: Record<
  PrismaCondition,
  "Brand New" | "Pre-owned"
> = {
  BrandNew: "Brand New",
  PreOwned: "Pre-owned",
};

export function toPrismaCategory(category: Category): PrismaCategory {
  return CATEGORY_TO_PRISMA[category];
}

export function toPrismaStock(stock: StockStatus): PrismaStockStatus {
  return STOCK_TO_PRISMA[stock];
}

export function toPrismaBrand(brand: Brand): PrismaBrand {
  return brand;
}

export function toPrismaCondition(
  condition: "Brand New" | "Pre-owned" = "Pre-owned"
): PrismaCondition {
  return CONDITION_TO_PRISMA[condition];
}

export function mapLaptopToProduct(laptop: Laptop): Product {
  return {
    id: laptop.id,
    name: laptop.name,
    brand: laptop.brand,
    category: CATEGORY_FROM_PRISMA[laptop.category],
    price: laptop.price,
    cpu: laptop.cpu,
    ram: laptop.ram,
    storage: laptop.storage,
    gpu: laptop.gpu ?? undefined,
    image: laptop.image,
    images: laptop.images ?? [],
    stock: STOCK_FROM_PRISMA[laptop.stock],
    condition: CONDITION_FROM_PRISMA[laptop.condition],
    createdAt: laptop.createdAt.toISOString().slice(0, 10),
    description: laptop.description ?? undefined,
    viewCount: laptop.viewCount,
    clickCount: laptop.clickCount,
  };
}

export function mapCreateInputToPrisma(data: CreateLaptopInput) {
  const images = (data.images ?? [])
    .map((url) => url.trim())
    .filter(Boolean);

  return {
    name: data.name.trim(),
    brand: toPrismaBrand(data.brand),
    category: toPrismaCategory(data.category),
    price: data.price,
    cpu: data.cpu.trim(),
    ram: data.ram.trim(),
    storage: data.storage.trim(),
    gpu: data.gpu?.trim() || null,
    image: data.image.trim() || images[0] || "",
    images,
    stock: toPrismaStock(data.stock),
    condition: toPrismaCondition(data.condition ?? "Brand New"),
    description: data.description?.trim() || null,
  };
}
