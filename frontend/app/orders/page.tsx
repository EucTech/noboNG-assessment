import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { OrdersLookup } from "@/features/orders";

export const metadata: Metadata = {
  title: "Your Orders",
  description: "Look up the orders you have placed with NoboNG.",
};

export default function OrdersPage() {
  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Orders" }]} />

      <h1 className="mt-3 mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        Your Orders
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Enter the email address you checked out with to find your orders.
      </p>

      <OrdersLookup />
    </div>
  );
}
