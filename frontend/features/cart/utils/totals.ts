import type { CartItem, CartTotals } from "../types";

export const SHIPPING_THRESHOLD_CENTS = 10_000;
export const STANDARD_SHIPPING_CENTS = 1_500;
export const CONSOLIDATED_SHIPPING_CENTS = 2_500;

export function calculateShipping(subtotalCents: number): number {
  if (subtotalCents <= 0) {
    return 0;
  }

  return subtotalCents < SHIPPING_THRESHOLD_CENTS
    ? STANDARD_SHIPPING_CENTS
    : CONSOLIDATED_SHIPPING_CENTS;
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  const subtotalCents = items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  );
  const shippingCents = calculateShipping(subtotalCents);

  return {
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
  };
}
