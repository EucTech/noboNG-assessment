import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Package, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDateTime, formatMoney } from "@/lib/format";
import type { Order } from "@/types";

import { OrderStatusBadge } from "./order-status-badge";
import { OrderTimeline } from "./order-timeline";
import { ORDER_STATUS_DESCRIPTION, isOrderPayable } from "../utils/status";

export function OrderDetail({ order }: { order: Order }) {
  const paid = order.paidAt !== null;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                paid ? "bg-success/12" : "bg-warning/12"
              }`}
            >
              {paid ? (
                <CheckCircle2 className="size-5 text-success" />
              ) : (
                <Package className="size-5 text-warning" />
              )}
            </span>
            <div>
              <h1 className="text-xl font-semibold">Order {order.reference}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {ORDER_STATUS_DESCRIPTION[order.status]}
              </p>
            </div>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <Separator className="my-5" />

        <dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Placed" value={formatDateTime(order.createdAt)} />
          <Field
            label="Paid"
            value={order.paidAt ? formatDateTime(order.paidAt) : "Not yet paid"}
          />
          <Field
            label="Items"
            value={`${order.items.reduce((count, item) => count + item.quantity, 0)} unit(s)`}
          />
          <Field
            label="Total paid"
            value={formatMoney(order.totalCents, order.currency)}
          />
        </dl>
      </div>

      <OrderTimeline order={order} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">Items</h2>
            <ul className="mt-4 flex flex-col gap-4">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                    <Image
                      src={item.productImage}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.productId}`}
                      className="line-clamp-2 text-sm font-medium hover:text-primary"
                    >
                      {item.productName}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                      {item.quantity} x{" "}
                      {formatMoney(item.unitPriceCents, order.currency)}
                    </p>
                  </div>
                  <p className="text-sm font-medium tabular-nums">
                    {formatMoney(item.lineTotalCents, order.currency)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">Payment Attempts</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {order.payments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface p-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      Attempt {payment.attempt} - {payment.status}
                    </p>
                    <p className="font-mono text-[11px] break-all text-muted-foreground">
                      {payment.providerReference ?? "No transaction reference yet"}
                    </p>
                    {payment.failureReason ? (
                      <p className="mt-0.5 text-xs text-destructive">
                        {payment.failureReason}
                      </p>
                    ) : null}
                  </div>
                  <span className="tabular-nums">
                    {formatMoney(payment.amountCents, payment.currency)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">Summary</h2>
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <Row label="Subtotal" value={formatMoney(order.subtotalCents, order.currency)} />
              <Row label="Shipping" value={formatMoney(order.shippingCents, order.currency)} />
              <Separator />
              <div className="flex items-center justify-between text-base font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">
                  {formatMoney(order.totalCents, order.currency)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">Delivery Address</h2>
            <address className="mt-3 text-sm not-italic leading-relaxed">
              <span className="font-medium">{order.customer.name}</span>
              <br />
              {order.customer.addressLine}
              <br />
              {order.customer.city}, {order.customer.state}
              <br />
              {order.customer.country}
              <br />
              <span className="text-muted-foreground">{order.customer.phone}</span>
              <br />
              <span className="break-all text-muted-foreground">
                {order.customer.email}
              </span>
            </address>
          </section>

          {order.shipment ? (
            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Truck className="size-4 text-primary" />
                Shipment
              </h2>
              <dl className="mt-3 flex flex-col gap-2 text-sm">
                <Row label="Status" value={order.shipment.status} />
                <Row
                  label="Carrier"
                  value={
                    order.shipment.provider === "pending_assignment"
                      ? "Awaiting assignment"
                      : order.shipment.provider
                  }
                />
                <Row
                  label="Tracking"
                  value={order.shipment.trackingNumber ?? "Not issued yet"}
                />
                <Row
                  label="Estimated"
                  value={
                    order.shipment.estimatedDelivery
                      ? formatDate(order.shipment.estimatedDelivery)
                      : "To be confirmed"
                  }
                />
              </dl>
            </section>
          ) : null}

          {isOrderPayable(order.status) ? (
            <Button asChild size="lg">
              <Link href="/checkout">Complete Payment</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" size="lg">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right tabular-nums">{value}</dd>
    </div>
  );
}
