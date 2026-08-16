import { PackageSearch } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import type { Product } from "@/types";

import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  emptyTitle = "No products found",
  emptyDescription = "Try a different search term or browse another category.",
}: {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
