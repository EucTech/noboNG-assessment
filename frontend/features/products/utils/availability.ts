import type { Product, ProductAvailability } from "@/types";

export const AVAILABILITY_LABEL: Record<ProductAvailability, string> = {
  IN_STOCK: "In Stock",
  LIMITED_STOCK: "Limited Stock",
  OUT_OF_STOCK: "Out of Stock",
};

export const AVAILABILITY_VARIANT: Record<
  ProductAvailability,
  "success" | "warning" | "destructive"
> = {
  IN_STOCK: "success",
  LIMITED_STOCK: "warning",
  OUT_OF_STOCK: "destructive",
};

export function isPurchasable(product: Product): boolean {
  return product.availability !== "OUT_OF_STOCK" && product.stockQuantity > 0;
}
