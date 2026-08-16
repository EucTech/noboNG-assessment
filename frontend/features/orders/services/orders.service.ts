import { apiRequest } from "@/lib/api-client";
import type { Order, OrderSummary } from "@/types";

export function fetchOrder(id: string): Promise<Order> {
  return apiRequest<Order>(`/orders/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
}

export function fetchOrdersByEmail(email: string): Promise<OrderSummary[]> {
  return apiRequest<OrderSummary[]>(
    `/orders?email=${encodeURIComponent(email)}`,
    { cache: "no-store" },
  );
}
