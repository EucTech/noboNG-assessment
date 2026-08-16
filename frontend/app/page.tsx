import Link from "next/link";

import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import { HeroBanner, ProductShowcase, ValueStrip } from "@/features/home";
import { fetchProducts } from "@/features/products";
import type { Product } from "@/types";

export default async function HomePage() {
  let products: Product[] = [];
  let failed = false;

  try {
    products = await fetchProducts({ limit: 12 });
  } catch {
    failed = true;
  }

  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <>
      <HeroBanner />
      <ValueStrip />

      {failed ? (
        <section className="container-page pt-12">
          <ErrorState
            title="Unable to load products"
            description="We could not reach the NoboNG catalogue. Please refresh the page to try again."
            action={
              <Button asChild variant="outline">
                <Link href="/products">Go to the shop</Link>
              </Button>
            }
          />
        </section>
      ) : (
        <>
          <ProductShowcase
            title="Top Rated"
            description="The products our customers rate highest this month."
            products={topRated}
          />
          <ProductShowcase
            title="Fresh Arrivals"
            description="Recently added to the NoboNG catalogue."
            products={products.slice(0, 8)}
          />
        </>
      )}
    </>
  );
}
