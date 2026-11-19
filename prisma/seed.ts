import {
  Brand,
  Category,
  Condition,
  PrismaClient,
  Role,
  StockStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const laptops = [
  {
    name: "HP EliteBook 840 G8",
    brand: Brand.HP,
    category: Category.OfficeBusiness,
    price: 1_850_000,
    cpu: "Core i7 11th Gen",
    ram: "16GB RAM",
    storage: "512GB NVMe SSD",
    gpu: null as string | null,
    image: "/uploads/laptops/hp-elitebook-1.jpg",
    images: [
      "/uploads/laptops/hp-elitebook-1.jpg",
      "/uploads/laptops/hp-elitebook-2.jpg",
    ],
    stock: StockStatus.IN_STOCK,
    condition: Condition.PreOwned,
    description:
      "Business ultrabook yenye keyboard comfy na battery ya muda mrefu.",
    viewCount: 128,
    clickCount: 34,
    createdAt: new Date("2026-10-12"),
  },
  {
    name: "Dell XPS 13 9310",
    brand: Brand.Dell,
    category: Category.CodingHeavyWork,
    price: 2_450_000,
    cpu: "Core i7 11th Gen",
    ram: "16GB RAM",
    storage: "512GB NVMe SSD",
    gpu: null,
    image: "/uploads/laptops/dell-xps-1.jpg",
    images: [
      "/uploads/laptops/dell-xps-1.jpg",
      "/uploads/laptops/dell-xps-2.jpg",
    ],
    stock: StockStatus.LIMITED_STOCK,
    condition: Condition.PreOwned,
    description: "InfinityEdge display — bora kwa developers na designers.",
    viewCount: 210,
    clickCount: 51,
    createdAt: new Date("2026-10-28"),
  },
  {
    name: "Lenovo ThinkPad T14 Gen 2",
    brand: Brand.Lenovo,
    category: Category.OfficeBusiness,
    price: 1_650_000,
    cpu: "Ryzen 5 Pro 5650U",
    ram: "16GB RAM",
    storage: "256GB NVMe SSD",
    gpu: null,
    image: "/uploads/laptops/thinkpad-1.jpg",
    images: [
      "/uploads/laptops/thinkpad-1.jpg",
      "/uploads/laptops/thinkpad-2.jpg",
    ],
    stock: StockStatus.IN_STOCK,
    condition: Condition.PreOwned,
    description: "Classic ThinkPad build quality — durable na reliable.",
    viewCount: 96,
    clickCount: 22,
    createdAt: new Date("2026-09-20"),
  },
  {
    name: 'Apple MacBook Pro 14" M1 Pro',
    brand: Brand.Apple,
    category: Category.CodingHeavyWork,
    price: 3_850_000,
    cpu: "Apple M1 Pro",
    ram: "16GB Unified",
    storage: "512GB SSD",
    gpu: "14-core GPU",
    image: "/uploads/laptops/macbook-1.jpg",
    images: [
      "/uploads/laptops/macbook-1.jpg",
      "/uploads/laptops/macbook-2.jpg",
    ],
    stock: StockStatus.LIMITED_STOCK,
    condition: Condition.PreOwned,
    description: "Powerhouse ya creative work na silent performance.",
    viewCount: 340,
    clickCount: 88,
    createdAt: new Date("2026-11-02"),
  },
  {
    name: "HP Victus 15 Gaming",
    brand: Brand.HP,
    category: Category.Gaming,
    price: 2_150_000,
    cpu: "Core i5 12th Gen",
    ram: "16GB RAM",
    storage: "512GB NVMe SSD",
    gpu: "RTX 3050 4GB",
    image: "/uploads/laptops/victus-1.jpg",
    images: [
      "/uploads/laptops/victus-1.jpg",
      "/uploads/laptops/victus-2.jpg",
    ],
    stock: StockStatus.IN_STOCK,
    condition: Condition.BrandNew,
    description: "Gaming laptop kwa bei nafuu — 144Hz display.",
    viewCount: 175,
    clickCount: 47,
    createdAt: new Date("2026-11-10"),
  },
  {
    name: "Dell G15 5520 Gaming",
    brand: Brand.Dell,
    category: Category.Gaming,
    price: 2_750_000,
    cpu: "Core i7 12th Gen",
    ram: "16GB RAM",
    storage: "512GB NVMe SSD",
    gpu: "RTX 3060 6GB",
    image: "/uploads/laptops/dell-g15-1.jpg",
    images: [
      "/uploads/laptops/dell-g15-1.jpg",
      "/uploads/laptops/dell-g15-2.jpg",
    ],
    stock: StockStatus.SOLD_OUT,
    condition: Condition.BrandNew,
    description: "RTX 3060 performance kwa gaming na content creation.",
    viewCount: 260,
    clickCount: 73,
    createdAt: new Date("2026-11-14"),
  },
];

async function main() {
  console.log("Seeding Ubepari PC...");

  const passwordHash = await bcrypt.hash("Admin@123", 10);

  await prisma.user.deleteMany();
  await prisma.laptop.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        name: "Super Admin",
        email: "superadmin@ubeparipc.co.tz",
        passwordHash,
        role: Role.SUPER_ADMIN,
      },
      {
        name: "Shop Owner",
        email: "owner@ubeparipc.co.tz",
        passwordHash,
        role: Role.OWNER,
      },
      {
        name: "Sales Clerk",
        email: "sales@ubeparipc.co.tz",
        passwordHash,
        role: Role.SALES_CLERK,
      },
    ],
  });

  for (const laptop of laptops) {
    await prisma.laptop.create({ data: laptop });
  }

  console.log("Seeded 3 admin users + 6 laptops with local upload photos.");
  console.log("Login: superadmin@ubeparipc.co.tz / Admin@123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
