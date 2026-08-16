import { Suspense } from "react";
import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ErrorState } from "@/components/common/error-state";
import {
  ProductFilters,
  ProductGrid,
  ProductGridSkeleton,
  fetchCategories,
  fetchProducts,
  type ProductQuery,
} from "@/features/products";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse the NoboNG catalogue of international products delivered to Nigeria.",
};

function parseSort(value?: string): ProductQuery["sort"] {
  return value === "price_asc" ||
    value === "price_desc" ||
    value === "rating" ||
    value === "newest"
    ? value
    : undefined;
}

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const params = await searchParams;
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const sort = parseSort(typeof params.sort === "string" ? params.sort : undefined);

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />

      <div className="mt-3 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          All Products
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every item is bought on your behalf and shipped to Nigeria.
        </p>
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductCatalogue category={category} sort={sort} />
      </Suspense>
    </div>
  );
}

async function ProductCatalogue({
  category,
  sort,
}: {
  category?: string;
  sort?: ProductQuery["sort"];
}) {
  let products;
  let categories: string[] = [];

  try {
    [products, categories] = await Promise.all([
      fetchProducts({ category, sort, limit: 50 }),
      fetchCategories(),
    ]);
  } catch {
    return (
      <ErrorState
        title="Unable to load products"
        description="We could not reach the NoboNG catalogue. Please refresh the page to try again."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProductFilters
        categories={categories}
        activeCategory={category}
        activeSort={sort}
      />
      <ProductGrid products={products} />
    </div>
  );
}
