"use client";

import { useMemo } from "react";

import { calculateCartTotals } from "../utils/totals";
import { useCartStore } from "../store/cart.store";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const hydrated = useCartStore((state) => state.hydrated);
  const addItem = useCartStore((state) => state.addItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);

  const totals = useMemo(() => calculateCartTotals(items), [items]);

  return { items, totals, hydrated, addItem, setQuantity, removeItem, clear };
}

export function useCartItemCount(): number {
  const items = useCartStore((state) => state.items);
  const hydrated = useCartStore((state) => state.hydrated);

  return hydrated
    ? items.reduce((count, item) => count + item.quantity, 0)
    : 0;
}
