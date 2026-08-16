import { describe, expect, it } from "vitest";

import {
  calculateCartTotals,
  calculateShipping,
  CONSOLIDATED_SHIPPING_CENTS,
  SHIPPING_THRESHOLD_CENTS,
  STANDARD_SHIPPING_CENTS,
} from "./totals";
import type { CartItem } from "../types";

function item(overrides: Partial<CartItem> = {}): CartItem {
  return {
    productId: "prod_1",
    slug: "nike-air-max-270",
    name: "Nike Air Max 270",
    imageUrl: "https://images.example/sneaker.jpg",
    unitPriceCents: 12_000,
    currency: "USD",
    maxQuantity: 10,
    quantity: 1,
    ...overrides,
  };
}

describe("calculateShipping", () => {
  it("is free when the cart is empty", () => {
    expect(calculateShipping(0)).toBe(0);
  });

  it("uses the standard rate below the threshold", () => {
    expect(calculateShipping(SHIPPING_THRESHOLD_CENTS - 1)).toBe(
      STANDARD_SHIPPING_CENTS,
    );
  });

  it("uses the consolidated rate from the threshold upwards", () => {
    expect(calculateShipping(SHIPPING_THRESHOLD_CENTS)).toBe(
      CONSOLIDATED_SHIPPING_CENTS,
    );
  });
});

describe("calculateCartTotals", () => {
  it("returns zeroes for an empty cart", () => {
    expect(calculateCartTotals([])).toEqual({
      subtotalCents: 0,
      shippingCents: 0,
      totalCents: 0,
      itemCount: 0,
    });
  });

  it("sums line totals and adds shipping", () => {
    const totals = calculateCartTotals([
      item({ quantity: 2 }),
      item({ productId: "prod_2", unitPriceCents: 9_995, quantity: 1 }),
    ]);

    expect(totals.subtotalCents).toBe(33_995);
    expect(totals.shippingCents).toBe(CONSOLIDATED_SHIPPING_CENTS);
    expect(totals.totalCents).toBe(33_995 + CONSOLIDATED_SHIPPING_CENTS);
    expect(totals.itemCount).toBe(3);
  });

  it("matches the shipping rule the backend applies to a small cart", () => {
    const totals = calculateCartTotals([
      item({ unitPriceCents: 7_900, quantity: 1 }),
    ]);

    expect(totals.shippingCents).toBe(STANDARD_SHIPPING_CENTS);
    expect(totals.totalCents).toBe(7_900 + STANDARD_SHIPPING_CENTS);
  });
});
