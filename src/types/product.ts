export type Brand = "HP" | "Dell" | "Lenovo" | "Apple" | "Asus" | "Acer";

export type Category =
  | "Gaming"
  | "Coding & Heavy Work"
  | "Office & Business"
  | "Budget";

export type StockStatus =
  | "IN STOCK"
  | "LIMITED STOCK"
  | "SOLD OUT"
  | "PRE-ORDER";

export type SortOption = "price-asc" | "price-desc" | "newest";

export interface Product {
  id: string;
  name: string;
  brand: Brand;
  category: Category;
  price: number;
  cpu: string;
  ram: string;
  storage: string;
  gpu?: string;
  image: string;
  images?: string[];
  stock: StockStatus;
  condition: "Brand New" | "Pre-owned";
  createdAt: string;
  description?: string;
  viewCount?: number;
  clickCount?: number;
}

export interface FilterState {
  brand: Brand | "All";
  category: Category | "All";
  maxPrice: number;
  sort: SortOption;
  search: string;
  page?: number;
  pageSize?: number;
}

export interface NewProductForm {
  name: string;
  brand: Brand;
  category: Category;
  price: string;
  ram: string;
  storage: string;
  cpu: string;
  gpu: string;
  image: string;
  stock: StockStatus;
  condition?: "Brand New" | "Pre-owned";
}

export interface LaptopListResult {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateLaptopInput {
  name: string;
  brand: Brand;
  category: Category;
  price: number;
  ram: string;
  storage: string;
  cpu: string;
  gpu?: string;
  image: string;
  images?: string[];
  stock: StockStatus;
  condition?: "Brand New" | "Pre-owned";
  description?: string;
}
