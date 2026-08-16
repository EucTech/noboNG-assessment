"use client";

import { useEffect } from "react";

import { useCartStore } from "../store/cart.store";

export function CartHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    useCartStore.getState().setHydrated();
  }, []);

  return null;
}
