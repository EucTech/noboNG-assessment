"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ShoppingCart } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/features/cart";
import { PaymentPanel } from "@/features/payments";
import { ApiError } from "@/lib/api-client";
import type { Order } from "@/types";

import { CheckoutForm } from "./checkout-form";
import { OrderSummaryPanel } from "./order-summary-panel";
import { createOrder } from "../services/checkout.service";
import type { CheckoutCustomer } from "../validation/checkout.schema";

export function CheckoutView() {
  const router = useRouter();
  const { items, totals, hydrated, clear } = useCart();

  const createOrderMutation = useMutation({
    mutationFn: (customer: CheckoutCustomer) => createOrder(items, customer),
  });

  const order = createOrderMutation.data ?? null;
  const errorMessage = createOrderMutation.isError
    ? createOrderMutation.error instanceof ApiError
      ? createOrderMutation.error.message
      : "We could not confirm your order. Please try again."
    : null;

  const handlePaymentSuccess = (paidOrder: Order) => {
    clear();
    router.push(`/orders/${paidOrder.id}`);
  };

  if (!hydrated) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
        <Skeleton className="h-[28rem] w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (items.length === 0 && !order) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="There is nothing to check out"
        description="Add a product to your cart before starting checkout."
        action={
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        }
      />
    );
  }

  const summaryLines = order
    ? order.items.map((item) => ({
        key: item.id,
        name: item.productName,
        imageUrl: item.productImage,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
      }))
    : items.map((item) => ({
        key: item.productId,
        name: item.name,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
      }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="flex flex-col gap-5">
        {order ? (
          <>
            <CustomerRecap order={order} />
            <PaymentPanel order={order} onSuccess={handlePaymentSuccess} />
          </>
        ) : (
          <>
            {errorMessage ? (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                <span className="text-muted-foreground">{errorMessage}</span>
              </div>
            ) : null}
            <CheckoutForm
              onSubmit={(customer) => createOrderMutation.mutate(customer)}
              submitting={createOrderMutation.isPending}
            />
          </>
        )}
      </div>

      <OrderSummaryPanel
        lines={summaryLines}
        subtotalCents={order ? order.subtotalCents : totals.subtotalCents}
        shippingCents={order ? order.shippingCents : totals.shippingCents}
        totalCents={order ? order.totalCents : totals.totalCents}
        currency={order?.currency ?? items[0]?.currency}
        note={
          order
            ? "These totals were calculated and locked by the NoboNG server from database prices."
            : "Final totals are recalculated by our server before payment."
        }
      />
    </div>
  );
}

function CustomerRecap({ order }: { order: Order }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-base font-semibold">Delivering To</h2>
      <div className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <Detail label="Name" value={order.customer.name} />
        <Detail label="Email" value={order.customer.email} />
        <Detail label="Phone" value={order.customer.phone} />
        <Detail
          label="Address"
          value={`${order.customer.addressLine}, ${order.customer.city}, ${order.customer.state}, ${order.customer.country}`}
        />
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="break-words">{value}</p>
    </div>
  );
}
