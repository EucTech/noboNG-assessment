import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ErrorState } from "@/components/common/error-state";
import { ProductDetail, ProductGrid, fetchProductById, fetchProducts } from "@/features/products";
import { ApiError, ApiErrorCode } from "@/lib/api-client";
import type { Product } from "@/types";

const RELATED_LIMIT = 4;

async function loadProduct(id: string): Promise<Product> {
  try {
    return await fetchProductById(id);
  } catch (error) {
    if (error instanceof ApiError && error.code === ApiErrorCode.PRODUCT_NOT_FOUND) {
      notFound();
    }

    throw error;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await fetchProductById(id);
    return {
      title: product.name,
      description: product.description.slice(0, 155),
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;

  let product: Product;

  try {
    product = await loadProduct(id);
  } catch {
    return (
      <div className="container-page pt-10">
        <ErrorState
          title="Unable to load this product"
          description="We could not reach the NoboNG catalogue. Please refresh the page to try again."
        />
      </div>
    );
  }

  let related: Product[] = [];

  try {
    const sameCategory = await fetchProducts({
      category: product.category,
      limit: RELATED_LIMIT + 1,
    });
    related = sameCategory
      .filter((item) => item.id !== product.id)
      .slice(0, RELATED_LIMIT);
  } catch {
    related = [];
  }

  return (
    <div className="container-page pt-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.category, href: `/products?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6">
        <ProductDetail product={product} />
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-5 text-xl font-semibold tracking-tight">
            More in {product.category}
          </h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </div>
  );
}
