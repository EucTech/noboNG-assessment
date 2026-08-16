import type { Product } from "@/types";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  unitPriceCents: number;
  currency: string;
  maxQuantity: number;
  quantity: number;
}

export interface CartTotals {
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  itemCount: number;
}

export type CartAddable = Pick<
  Product,
  "id" | "slug" | "name" | "imageUrl" | "priceCents" | "currency" | "stockQuantity"
>;
