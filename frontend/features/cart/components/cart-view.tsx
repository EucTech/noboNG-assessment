"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useCart } from "../hooks/use-cart";
import { CartLineItem } from "./cart-line-item";
import { CartSummary } from "./cart-summary";

export function CartView() {
  const { items, totals, hydrated, setQuantity, removeItem } = useCart();

  if (!hydrated) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Browse the catalogue and add something you would like us to buy and ship to Nigeria."
        action={
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <ul className="flex flex-col gap-3 lg:col-span-2">
        {items.map((item) => (
          <CartLineItem
            key={item.productId}
            item={item}
            onQuantityChange={(quantity) => setQuantity(item.productId, quantity)}
            onRemove={() => removeItem(item.productId)}
          />
        ))}
      </ul>

      <CartSummary
        totals={totals}
        currency={items[0]?.currency}
        note="Shipping is estimated here and confirmed by our server at checkout."
      >
        <Button asChild size="lg" className="w-full">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </CartSummary>
    </div>
  );
}
