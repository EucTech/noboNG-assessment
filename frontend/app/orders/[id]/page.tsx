import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ErrorState } from "@/components/common/error-state";
import { OrderDetail, fetchOrder } from "@/features/orders";
import { ApiError, ApiErrorCode } from "@/lib/api-client";
import type { Order } from "@/types";

export const metadata: Metadata = {
  title: "Order Details",
  description: "Track the status of your NoboNG order.",
};

export default async function OrderDetailPage({
  params,
}: PageProps<"/orders/[id]">) {
  const { id } = await params;

  let order: Order;

  try {
    order = await fetchOrder(id);
  } catch (error) {
    if (error instanceof ApiError && error.code === ApiErrorCode.ORDER_NOT_FOUND) {
      notFound();
    }

    return (
      <div className="container-page pt-10">
        <ErrorState
          title="Unable to load this order"
          description="We could not reach the NoboNG service. Please refresh the page to try again."
        />
      </div>
    );
  }

  return (
    <div className="container-page pt-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: order.reference },
        ]}
      />

      <div className="mt-6">
        <OrderDetail order={order} />
      </div>
    </div>
  );
}
