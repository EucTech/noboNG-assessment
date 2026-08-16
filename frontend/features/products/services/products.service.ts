import { apiRequest } from "@/lib/api-client";
import type { Product } from "@/types";

export interface ProductQuery {
  search?: string;
  category?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "rating";
  limit?: number;
}

const LIST_REVALIDATE_SECONDS = 30;

function toSearchParams(query: ProductQuery): string {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.sort) params.set("sort", query.sort);
  if (query.limit) params.set("limit", String(query.limit));

  const serialised = params.toString();
  return serialised ? `?${serialised}` : "";
}

export function fetchProducts(query: ProductQuery = {}): Promise<Product[]> {
  return apiRequest<Product[]>(`/products${toSearchParams(query)}`, {
    revalidate: LIST_REVALIDATE_SECONDS,
  });
}

export function fetchProductById(id: string): Promise<Product> {
  return apiRequest<Product>(`/products/${encodeURIComponent(id)}`, {
    revalidate: LIST_REVALIDATE_SECONDS,
  });
}

export function fetchCategories(): Promise<string[]> {
  return apiRequest<string[]>("/products/categories", {
    revalidate: LIST_REVALIDATE_SECONDS,
  });
}
