"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartAddable, CartItem } from "../types";

interface CartState {
  items: CartItem[];
  hydrated: boolean;
  addItem: (product: CartAddable, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  setHydrated: () => void;
}

function toCartItem(product: CartAddable, quantity: number): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    unitPriceCents: product.priceCents,
    currency: product.currency,
    maxQuantity: product.stockQuantity,
    quantity,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.id,
          );

          if (!existing) {
            return { items: [...state.items, toCartItem(product, quantity)] };
          }

          return {
            items: state.items.map((item) =>
              item.productId === product.id
                ? {
                    ...item,
                    unitPriceCents: product.priceCents,
                    maxQuantity: product.stockQuantity,
                    quantity: Math.min(
                      item.quantity + quantity,
                      product.stockQuantity,
                    ),
                  }
                : item,
            ),
          };
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.map((item) =>
                  item.productId === productId
                    ? {
                        ...item,
                        quantity: Math.min(quantity, item.maxQuantity),
                      }
                    : item,
                ),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      clear: () => set({ items: [] }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "nobong-cart",
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
