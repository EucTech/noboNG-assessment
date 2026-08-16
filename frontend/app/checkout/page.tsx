import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { CheckoutView } from "@/features/checkout";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your delivery details and complete payment for your order.",
};

export default function CheckoutPage() {
  return (
    <div className="container-page pt-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <h1 className="mt-3 mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">
        Checkout
      </h1>

      <CheckoutView />
    </div>
  );
}
