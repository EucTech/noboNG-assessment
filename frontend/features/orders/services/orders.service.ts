import { apiRequest } from "@/lib/api-client";
import { httpClient } from "@/lib/axios-client";
import type { Order, OrderSummary } from "@/types";

export function fetchOrder(id: string): Promise<Order> {
  return apiRequest<Order>(`/orders/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
}

export async function fetchOrdersByEmail(email: string): Promise<OrderSummary[]> {
  const { data } = await httpClient.get<OrderSummary[]>("/orders", {
    params: { email },
  });

  return data;
}
