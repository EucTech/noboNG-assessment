import Image from "next/image";
import Link from "next/link";
import { Truck } from "lucide-react";

import { StarRating } from "@/components/common/star-rating";
import { Button } from "@/components/ui/button";
import { formatDeliveryWindow, formatMoney } from "@/lib/format";
import type { Product } from "@/types";

import { AvailabilityBadge } from "./availability-badge";
import { AddToCartButton } from "./add-to-cart-button";
import { isPurchasable } from "../utils/availability";

export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.id}`;
  const purchasable = isPurchasable(product);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-black/5">
      <Link
        href={href}
        className="relative block aspect-square overflow-hidden bg-surface"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 46vw, 100vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            purchasable ? "" : "opacity-60 grayscale"
          }`}
        />
        <AvailabilityBadge
          availability={product.availability}
          className="absolute left-3 top-3 bg-background/90 backdrop-blur"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {product.category}
        </p>

        <Link href={href}>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <StarRating rating={product.rating} ratingCount={product.ratingCount} />

        <p className="text-lg font-semibold tabular-nums">
          {formatMoney(product.priceCents, product.currency)}
        </p>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Truck className="size-3.5" />
          {formatDeliveryWindow(product.deliveryMinDays, product.deliveryMaxDays)}
        </p>

        <div className="mt-auto flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={href}>View Details</Link>
          </Button>
          <AddToCartButton product={product} className="flex-1" />
        </div>
      </div>
    </article>
  );
}
