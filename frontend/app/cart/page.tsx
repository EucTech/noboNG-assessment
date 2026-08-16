import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CartView } from "@/features/cart";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review the items in your NoboNG cart before checking out.",
};

export default function CartPage() {
  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />

      <h1 className="mt-3 mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">
        Your Cart
      </h1>

      <CartView />
    </div>
  );
}
