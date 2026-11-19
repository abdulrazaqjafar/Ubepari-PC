"use server";

import { revalidatePath } from "next/cache";
import type { Prisma, StockStatus as PrismaStockStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  requireCreateLaptops,
  requireDeleteLaptops,
  requireSession,
  requireUpdateStock,
} from "@/lib/auth-guards";
import {
  mapCreateInputToPrisma,
  mapLaptopToProduct,
  toPrismaStock,
} from "@/lib/laptop-mapper";
import type { CreateLaptopInput, Product, StockStatus } from "@/types/product";
import { canDeleteLaptops } from "@/lib/rbac";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function getDashboardStats(): Promise<
  ActionResult<{
    totalActive: number;
    soldOut: number;
    totalViews: number;
    totalClicks: number;
    limited: number;
  }>
> {
  try {
    await requireSession();

    const [totalActive, soldOut, limited, aggregates] = await Promise.all([
      prisma.laptop.count({
        where: { stock: { in: ["IN_STOCK", "LIMITED_STOCK", "PRE_ORDER"] } },
      }),
      prisma.laptop.count({ where: { stock: "SOLD_OUT" } }),
      prisma.laptop.count({ where: { stock: "LIMITED_STOCK" } }),
      prisma.laptop.aggregate({
        _sum: { viewCount: true, clickCount: true },
      }),
    ]);

    return {
      ok: true,
      data: {
        totalActive,
        soldOut,
        limited,
        totalViews: aggregates._sum.viewCount ?? 0,
        totalClicks: aggregates._sum.clickCount ?? 0,
      },
    };
  } catch {
    return { ok: false, error: "Imeshindikana kupata stats." };
  }
}

export async function getAdminLaptops(input?: {
  search?: string;
  stock?: StockStatus | "ALL";
}): Promise<ActionResult<Product[]>> {
  try {
    await requireSession();
    const where: Prisma.LaptopWhereInput = {};

    if (input?.search?.trim()) {
      const q = input.search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { cpu: { contains: q, mode: "insensitive" } },
        { ram: { contains: q, mode: "insensitive" } },
      ];
    }

    if (input?.stock && input.stock !== "ALL") {
      where.stock = toPrismaStock(input.stock);
    }

    const rows = await prisma.laptop.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return { ok: true, data: rows.map(mapLaptopToProduct) };
  } catch {
    return { ok: false, error: "Imeshindikana kupata laptops." };
  }
}

export async function adminCreateLaptop(
  data: CreateLaptopInput & { images?: string[] }
): Promise<ActionResult<Product>> {
  try {
    await requireCreateLaptops();

    if (!data.name?.trim()) {
      return { ok: false, error: "Product name is required." };
    }
    if (!data.price || data.price < 100_000) {
      return { ok: false, error: "Enter a valid price (min TZS 100,000)." };
    }

    const images = (data.images ?? [])
      .map((url) => url.trim())
      .filter(Boolean);

    const laptop = await prisma.laptop.create({
      data: {
        ...mapCreateInputToPrisma(data),
        images,
        image: data.image.trim() || images[0] || "",
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { ok: true, data: mapLaptopToProduct(laptop) };
  } catch {
    return { ok: false, error: "Imeshindikana kuongeza laptop." };
  }
}

export async function getLaptopForEdit(
  id: string
): Promise<ActionResult<Product>> {
  try {
    await requireSession();
    const laptop = await prisma.laptop.findUnique({ where: { id } });
    if (!laptop) return { ok: false, error: "Laptop haijapatikana." };
    return { ok: true, data: mapLaptopToProduct(laptop) };
  } catch {
    return { ok: false, error: "Imeshindikana kupata laptop." };
  }
}

export async function adminUpdateLaptop(
  id: string,
  data: CreateLaptopInput & { images?: string[] }
): Promise<ActionResult<Product>> {
  try {
    await requireCreateLaptops();

    if (!data.name?.trim()) {
      return { ok: false, error: "Product name is required." };
    }
    if (!data.price || data.price < 100_000) {
      return { ok: false, error: "Enter a valid price (min TZS 100,000)." };
    }

    const images = (data.images ?? [])
      .map((url) => url.trim())
      .filter(Boolean);

    const laptop = await prisma.laptop.update({
      where: { id },
      data: {
        ...mapCreateInputToPrisma(data),
        images,
        image: data.image.trim() || images[0] || "",
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { ok: true, data: mapLaptopToProduct(laptop) };
  } catch {
    return { ok: false, error: "Imeshindikana kusasisha laptop." };
  }
}

export async function adminUpdateLaptopStatus(
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
  } catch {
    return { ok: false, error: "Imeshindikana kubadilisha status." };
  }
}

export async function adminDeleteLaptop(
  id: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireDeleteLaptops();
    if (!canDeleteLaptops(session.user.role)) {
      return { ok: false, error: "Sales Clerk hawezi kufuta laptops." };
    }

    await prisma.laptop.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { ok: true, data: { id } };
  } catch {
    return { ok: false, error: "Imeshindikana kufuta laptop." };
  }
}

export async function trackLaptopView(id: string) {
  try {
    await prisma.laptop.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // ignore analytics failures
  }
}

export async function trackLaptopClick(id: string) {
  try {
    await prisma.laptop.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });
  } catch {
    // ignore analytics failures
  }
}
