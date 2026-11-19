-- CreateEnum
CREATE TYPE "Brand" AS ENUM ('HP', 'Dell', 'Lenovo', 'Apple', 'Asus', 'Acer');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Gaming', 'CodingHeavyWork', 'OfficeBusiness', 'Budget');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('IN_STOCK', 'LIMITED_STOCK', 'SOLD_OUT', 'PRE_ORDER');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('BrandNew', 'PreOwned');

-- CreateTable
CREATE TABLE "Laptop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" "Brand" NOT NULL,
    "category" "Category" NOT NULL,
    "price" INTEGER NOT NULL,
    "cpu" TEXT NOT NULL,
    "ram" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "gpu" TEXT,
    "image" TEXT NOT NULL,
    "stock" "StockStatus" NOT NULL DEFAULT 'IN_STOCK',
    "condition" "Condition" NOT NULL DEFAULT 'PreOwned',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Laptop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Laptop_brand_idx" ON "Laptop"("brand");

-- CreateIndex
CREATE INDEX "Laptop_category_idx" ON "Laptop"("category");

-- CreateIndex
CREATE INDEX "Laptop_price_idx" ON "Laptop"("price");

-- CreateIndex
CREATE INDEX "Laptop_stock_idx" ON "Laptop"("stock");

-- CreateIndex
CREATE INDEX "Laptop_createdAt_idx" ON "Laptop"("createdAt");
