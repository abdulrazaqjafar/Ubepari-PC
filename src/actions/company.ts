"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";
import { mapLaptopToProduct } from "@/lib/laptop-mapper";
import type { Product } from "@/types/product";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type CompanyInsights = {
  inventoryValue: number;
  soldOutValue: number;
  totalListings: number;
  activeListings: number;
  soldOutCount: number;
  limitedCount: number;
  preOrderCount: number;
  brandNewCount: number;
  preOwnedCount: number;
  totalViews: number;
  totalClicks: number;
  engagementRate: number;
  avgPrice: number;
  staff: {
    total: number;
    active: number;
    owners: number;
    clerks: number;
    superAdmins: number;
  };
  byBrand: Array<{
    brand: string;
    count: number;
    value: number;
    views: number;
    clicks: number;
  }>;
  byCategory: Array<{
    category: string;
    count: number;
    value: number;
  }>;
  topViewed: Product[];
  topClicked: Product[];
  needsAttention: Product[];
  recentlyUpdated: Product[];
};

const CATEGORY_LABEL: Record<string, string> = {
  Gaming: "Gaming",
  CodingHeavyWork: "Coding & Heavy Work",
  OfficeBusiness: "Office & Business",
  Budget: "Budget",
};

export async function getCompanyInsights(): Promise<
  ActionResult<CompanyInsights>
> {
  try {
    await requireRole(["OWNER", "SUPER_ADMIN"]);

    const [laptops, users] = await Promise.all([
      prisma.laptop.findMany({ orderBy: { updatedAt: "desc" } }),
      prisma.user.findMany({
        select: { role: true, active: true },
      }),
    ]);

    const activeStock = ["IN_STOCK", "LIMITED_STOCK", "PRE_ORDER"] as const;
    const active = laptops.filter((l) =>
      (activeStock as readonly string[]).includes(l.stock)
    );
    const soldOut = laptops.filter((l) => l.stock === "SOLD_OUT");
    const limited = laptops.filter((l) => l.stock === "LIMITED_STOCK");
    const preOrder = laptops.filter((l) => l.stock === "PRE_ORDER");

    const inventoryValue = active.reduce((sum, l) => sum + l.price, 0);
    const soldOutValue = soldOut.reduce((sum, l) => sum + l.price, 0);
    const totalViews = laptops.reduce((sum, l) => sum + l.viewCount, 0);
    const totalClicks = laptops.reduce((sum, l) => sum + l.clickCount, 0);

    const brandMap = new Map<
      string,
      { count: number; value: number; views: number; clicks: number }
    >();
    const categoryMap = new Map<string, { count: number; value: number }>();

    for (const laptop of laptops) {
      const brand = brandMap.get(laptop.brand) ?? {
        count: 0,
        value: 0,
        views: 0,
        clicks: 0,
      };
      brand.count += 1;
      brand.views += laptop.viewCount;
      brand.clicks += laptop.clickCount;
      if (laptop.stock !== "SOLD_OUT") brand.value += laptop.price;
      brandMap.set(laptop.brand, brand);

      const catKey = CATEGORY_LABEL[laptop.category] ?? laptop.category;
      const cat = categoryMap.get(catKey) ?? { count: 0, value: 0 };
      cat.count += 1;
      if (laptop.stock !== "SOLD_OUT") cat.value += laptop.price;
      categoryMap.set(catKey, cat);
    }

    const topViewed = [...laptops]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map(mapLaptopToProduct);

    const topClicked = [...laptops]
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 5)
      .map(mapLaptopToProduct);

    const needsAttention = laptops
      .filter((l) => l.stock === "LIMITED_STOCK" || l.stock === "PRE_ORDER")
      .slice(0, 8)
      .map(mapLaptopToProduct);

    const recentlyUpdated = laptops.slice(0, 6).map(mapLaptopToProduct);

    return {
      ok: true,
      data: {
        inventoryValue,
        soldOutValue,
        totalListings: laptops.length,
        activeListings: active.length,
        soldOutCount: soldOut.length,
        limitedCount: limited.length,
        preOrderCount: preOrder.length,
        brandNewCount: laptops.filter((l) => l.condition === "BrandNew").length,
        preOwnedCount: laptops.filter((l) => l.condition === "PreOwned").length,
        totalViews,
        totalClicks,
        engagementRate:
          totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0,
        avgPrice:
          active.length > 0 ? Math.round(inventoryValue / active.length) : 0,
        staff: {
          total: users.length,
          active: users.filter((u) => u.active).length,
          owners: users.filter((u) => u.role === "OWNER").length,
          clerks: users.filter((u) => u.role === "SALES_CLERK").length,
          superAdmins: users.filter((u) => u.role === "SUPER_ADMIN").length,
        },
        byBrand: [...brandMap.entries()]
          .map(([brand, stats]) => ({ brand, ...stats }))
          .sort((a, b) => b.value - a.value),
        byCategory: [...categoryMap.entries()]
          .map(([category, stats]) => ({ category, ...stats }))
          .sort((a, b) => b.count - a.count),
        topViewed,
        topClicked,
        needsAttention,
        recentlyUpdated,
      },
    };
  } catch {
    return { ok: false, error: "Hauna ruhusa au data haikupatikana." };
  }
}
