"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { QuantityStepper } from "@/components/common/quantity-stepper";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";

import type { CartItem } from "../types";

export function CartLineItem({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <Link
        href={`/products/${item.productId}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface sm:size-24"
      >
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${item.productId}`}
              className="line-clamp-2 text-sm font-medium hover:text-primary"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-xs text-muted-foreground tabular-nums">
              {formatMoney(item.unitPriceCents, item.currency)} each
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label={`Remove ${item.name} from cart`}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <QuantityStepper
            value={item.quantity}
            max={Math.min(item.maxQuantity, 20)}
            onChange={onQuantityChange}
          />
          <p className="text-sm font-semibold tabular-nums">
            {formatMoney(item.unitPriceCents * item.quantity, item.currency)}
          </p>
        </div>
      </div>
    </li>
  );
}
