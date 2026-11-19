import type { Product } from "@/types/product";
import { WHATSAPP_NUMBER } from "@/data/products";

export function formatTZS(price: number): string {
  return `TZS ${price.toLocaleString("en-TZ")}`;
}

export function buildWhatsAppLink(product: Product): string {
  const specs = [product.cpu, product.ram, product.storage, product.gpu]
    .filter(Boolean)
    .join(" / ");

  const message = `Habari Ubepari PC! Nahitaji kununua laptop hii: ${product.name} - Specs: ${specs} - Bei: TZS ${product.price.toLocaleString("en-TZ")}. Bado ipo stock?`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
