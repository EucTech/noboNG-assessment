import { beforeEach, describe, expect, it } from "vitest";

import { useCartStore } from "./cart.store";
import type { CartAddable } from "../types";

const SNEAKER: CartAddable = {
  id: "prod_sneaker",
  slug: "nike-air-max-270",
  name: "Nike Air Max 270",
  imageUrl: "https://images.example/sneaker.jpg",
  priceCents: 12_000,
  currency: "USD",
  stockQuantity: 5,
};

const WATCH: CartAddable = {
  id: "prod_watch",
  slug: "samsung-galaxy-watch-6-classic",
  name: "Samsung Galaxy Watch 6 Classic",
  imageUrl: "https://images.example/watch.jpg",
  priceCents: 19_900,
  currency: "USD",
  stockQuantity: 6,
};

describe("cart store", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], hydrated: true });
  });

  it("adds a product with the requested quantity", () => {
    useCartStore.getState().addItem(SNEAKER, 2);

    const [line] = useCartStore.getState().items;

    expect(line.productId).toBe(SNEAKER.id);
    expect(line.quantity).toBe(2);
    expect(line.unitPriceCents).toBe(SNEAKER.priceCents);
  });

  it("keeps one line per product and accumulates the quantity", () => {
    useCartStore.getState().addItem(SNEAKER, 1);
    useCartStore.getState().addItem(SNEAKER, 2);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it("never lets the quantity exceed the stock on hand", () => {
    useCartStore.getState().addItem(SNEAKER, 4);
    useCartStore.getState().addItem(SNEAKER, 4);

    expect(useCartStore.getState().items[0].quantity).toBe(SNEAKER.stockQuantity);
  });

  it("clamps a direct quantity change to the stock on hand", () => {
    useCartStore.getState().addItem(SNEAKER, 1);
    useCartStore.getState().setQuantity(SNEAKER.id, 99);

    expect(useCartStore.getState().items[0].quantity).toBe(SNEAKER.stockQuantity);
  });

  it("removes the line when the quantity drops below one", () => {
    useCartStore.getState().addItem(SNEAKER, 1);
    useCartStore.getState().setQuantity(SNEAKER.id, 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("removes only the requested product", () => {
    useCartStore.getState().addItem(SNEAKER, 1);
    useCartStore.getState().addItem(WATCH, 1);
    useCartStore.getState().removeItem(SNEAKER.id);

    expect(useCartStore.getState().items.map((line) => line.productId)).toEqual([
      WATCH.id,
    ]);
  });

  it("empties the cart after a successful order", () => {
    useCartStore.getState().addItem(SNEAKER, 1);
    useCartStore.getState().addItem(WATCH, 2);
    useCartStore.getState().clear();

    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
