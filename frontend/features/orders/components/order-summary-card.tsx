import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";

import { formatDate, formatMoney } from "@/lib/format";
import type { OrderSummary } from "@/types";

import { OrderStatusBadge } from "./order-status-badge";

export function OrderSummaryCard({ order }: { order: OrderSummary }) {
  return (
    <li>
      <Link
        href={`/orders/${order.reference}`}
        className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-lg hover:shadow-black/5"
      >
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface">
          {order.previewImage ? (
            <Image
              src={order.previewImage}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <Package className="size-5 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{order.reference}</p>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {formatDate(order.createdAt)} &middot; {order.itemCount} unit
            {order.itemCount === 1 ? "" : "s"}
          </p>
        </div>

        <p className="shrink-0 font-semibold tabular-nums">
          {formatMoney(order.totalCents, order.currency)}
        </p>
      </Link>
    </li>
  );
}
