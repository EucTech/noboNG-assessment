import { apiRequest } from "@/lib/api-client";
import type { CartItem } from "@/features/cart";
import type { Order } from "@/types";

import type { CheckoutCustomer } from "../validation/checkout.schema";

export function createOrder(
  items: CartItem[],
  customer: CheckoutCustomer,
): Promise<Order> {
  return apiRequest<Order>("/orders", {
    method: "POST",
    body: {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        addressLine: customer.addressLine,
        city: customer.city,
        state: customer.state,
        country: "Nigeria",
      },
    },
  });
}
