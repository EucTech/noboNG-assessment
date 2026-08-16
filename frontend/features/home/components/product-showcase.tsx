import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductGrid } from "@/features/products";
import type { Product } from "@/types";

export function ProductShowcase({
  title,
  description,
  products,
  viewAllHref = "/products",
}: {
  title: string;
  description?: string;
  products: Product[];
  viewAllHref?: string;
}) {
  return (
    <section className="container-page pt-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}
