"use client";

import Image from "next/image";
import { useState } from "react";
import { Globe2, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { QuantityStepper } from "@/components/common/quantity-stepper";
import { StarRating } from "@/components/common/star-rating";
import { Separator } from "@/components/ui/separator";
import { formatDeliveryWindow, formatMoney } from "@/lib/format";
import type { Product } from "@/types";

import { AvailabilityBadge } from "./availability-badge";
import { AddToCartButton } from "./add-to-cart-button";
import { isPurchasable } from "../utils/availability";

const ASSURANCES = [
  {
    icon: Globe2,
    title: "Sourced internationally",
    description: "Bought on your behalf from an authorised overseas retailer.",
  },
  {
    icon: PackageCheck,
    title: "Consolidated shipping",
    description: "Items are grouped at our hub before the final leg to Nigeria.",
  },
  {
    icon: ShieldCheck,
    title: "Buyer protection",
    description: "Full refund if the item never arrives or is not as described.",
  },
];

export function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const purchasable = isPurchasable(product);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface lg:sticky lg:top-24 lg:self-start">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          priority
          sizes="(min-width: 1024px) 46vw, 100vw"
          className={`object-cover ${purchasable ? "" : "opacity-60 grayscale"}`}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.category}
            </p>
            <AvailabilityBadge availability={product.availability} />
          </div>

          <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">
            {product.name}
          </h1>

          <StarRating rating={product.rating} ratingCount={product.ratingCount} />
        </div>

        <p className="text-3xl font-semibold tabular-nums">
          {formatMoney(product.priceCents * quantity, product.currency)}
        </p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="flex items-center gap-2 rounded-lg bg-surface p-3 text-sm">
          <Truck className="size-4 shrink-0 text-primary" />
          <span>
            Estimated delivery{" "}
            <strong className="font-medium">
              {formatDeliveryWindow(
                product.deliveryMinDays,
                product.deliveryMaxDays,
              )}
            </strong>{" "}
            after payment
          </span>
        </div>

        <Separator />

        {purchasable ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity</span>
              <QuantityStepper
                value={quantity}
                max={Math.min(product.stockQuantity, 20)}
                onChange={setQuantity}
              />
              <span className="text-xs text-muted-foreground">
                {product.stockQuantity} available
              </span>
            </div>

            <AddToCartButton
              product={product}
              quantity={quantity}
              size="lg"
              className="sm:w-fit sm:px-12"
            />
          </div>
        ) : (
          <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-4">
            <p className="text-sm font-medium">
              This product is currently out of stock
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              We are securing the next consolidation batch. It cannot be added to
              your cart until stock is confirmed.
            </p>
          </div>
        )}

        <Separator />

        <ul className="flex flex-col gap-4">
          {ASSURANCES.map((assurance) => (
            <li key={assurance.title} className="flex gap-3">
              <assurance.icon className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">{assurance.title}</p>
                <p className="text-sm text-muted-foreground">
                  {assurance.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
