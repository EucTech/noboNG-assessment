"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart";
import type { Product } from "@/types";

import { isPurchasable } from "../utils/availability";

const CONFIRMATION_MS = 1600;

export function AddToCartButton({
  product,
  quantity = 1,
  size = "sm",
  variant = "default",
  className,
  fullWidth = false,
}: {
  product: Product;
  quantity?: number;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "accent" | "outline" | "secondary";
  className?: string;
  fullWidth?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const purchasable = isPurchasable(product);

  const handleClick = () => {
    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), CONFIRMATION_MS);
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      disabled={!purchasable}
      onClick={handleClick}
      className={fullWidth ? `w-full ${className ?? ""}` : className}
      aria-label={
        purchasable ? `Add ${product.name} to cart` : `${product.name} is unavailable`
      }
    >
      {added ? <Check /> : <ShoppingCart />}
      {!purchasable ? "Unavailable" : added ? "Added to cart" : "Add to Cart"}
    </Button>
  );
}
