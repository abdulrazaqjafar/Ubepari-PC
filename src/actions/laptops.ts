"use server";

import { revalidatePath } from "next/cache";
import type { Prisma, StockStatus as PrismaStockStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  requireCreateLaptops,
  requireDeleteLaptops,
  requireUpdateStock,
} from "@/lib/auth-guards";
import {
  mapCreateInputToPrisma,
  mapLaptopToProduct,
  toPrismaBrand,
  toPrismaCategory,
  toPrismaStock,
} from "@/lib/laptop-mapper";
import type {
  CreateLaptopInput,
  FilterState,
  LaptopListResult,
  Product,
  StockStatus,
} from "@/types/product";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const DEFAULT_PAGE_SIZE = 24;

export async function getLaptops(
  filters: Partial<FilterState> = {}
): Promise<ActionResult<LaptopListResult>> {
  try {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
    const where: Prisma.LaptopWhereInput = {};

    if (filters.search?.trim()) {
      const q = filters.search.trim();
      const brandMatch = tryBrand(q);
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { cpu: { contains: q, mode: "insensitive" } },
        { ram: { contains: q, mode: "insensitive" } },
        { storage: { contains: q, mode: "insensitive" } },
        { gpu: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        ...(brandMatch ? [{ brand: { equals: brandMatch } }] : []),
      ];
    }

    if (filters.brand && filters.brand !== "All") {
      where.brand = toPrismaBrand(filters.brand);
    }

    if (filters.category && filters.category !== "All") {
      where.category = toPrismaCategory(filters.category);
    }

    if (typeof filters.maxPrice === "number" && filters.maxPrice > 0) {
      where.price = { lte: filters.maxPrice };
    }

    // Hide sold-out by default in catalog
    where.stock = { not: "SOLD_OUT" };

    let orderBy: Prisma.LaptopOrderByWithRelationInput = { createdAt: "desc" };
    switch (filters.sort) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const [total, rows] = await Promise.all([
      prisma.laptop.count({ where }),
      prisma.laptop.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      ok: true,
      data: {
        items: rows.map(mapLaptopToProduct),
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  } catch (error) {
    console.error("getLaptops failed:", error);
    return {
      ok: false,
      error: "Imeshindikana kupata laptops. Hakikisha database inaendesha.",
    };
  }
}

export async function createLaptop(
  data: CreateLaptopInput
): Promise<ActionResult<Product>> {
  try {
    await requireCreateLaptops();

    if (!data.name?.trim()) {
      return { ok: false, error: "Product name is required." };
    }
    if (!data.price || data.price < 100_000) {
      return { ok: false, error: "Enter a valid price (min TZS 100,000)." };
    }

    const laptop = await prisma.laptop.create({
      data: mapCreateInputToPrisma(data),
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { ok: true, data: mapLaptopToProduct(laptop) };
  } catch (error) {
    console.error("createLaptop failed:", error);
    return { ok: false, error: "Imeshindikana kuongeza laptop." };
  }
}

export async function updateLaptopStatus(
  id: string,
  status: StockStatus
): Promise<ActionResult<Product>> {
  try {
    await requireUpdateStock();
    const prismaStatus: PrismaStockStatus = toPrismaStock(status);
    const laptop = await prisma.laptop.update({
      where: { id },
      data: { stock: prismaStatus },
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { ok: true, data: mapLaptopToProduct(laptop) };
  } catch (error) {
    console.error("updateLaptopStatus failed:", error);
    return { ok: false, error: "Imeshindikana kubadilisha status." };
  }
}

export async function deleteLaptop(
  id: string
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireDeleteLaptops();
    await prisma.laptop.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { ok: true, data: { id } };
  } catch (error) {
    console.error("deleteLaptop failed:", error);
    return { ok: false, error: "Imeshindikana kufuta laptop." };
  }
}

function tryBrand(q: string) {
  const normalized = q.trim().toLowerCase();
  const map: Record<string, ReturnType<typeof toPrismaBrand>> = {
    hp: "HP",
    dell: "Dell",
    lenovo: "Lenovo",
    apple: "Apple",
    asus: "Asus",
    acer: "Acer",
  };
  return map[normalized];
}
