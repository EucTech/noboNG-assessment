import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PENDING_PAYMENT", label: "Order Placed" },
  { status: "PAID", label: "Payment Confirmed" },
  { status: "PROCESSING", label: "Processing" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "DELIVERED", label: "Delivered" },
];

const ORDER_OF_PROGRESS: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export function OrderTimeline({ order }: { order: Order }) {
  if (order.status === "CANCELLED") {
    return null;
  }

  const currentIndex = ORDER_OF_PROGRESS.indexOf(
    order.status === "PAYMENT_FAILED" ? "PENDING_PAYMENT" : order.status,
  );

  return (
    <ol className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 md:flex-row md:items-center md:gap-0">
      {STEPS.map((step, index) => {
        const reached = index <= currentIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <li
            key={step.status}
            className={cn("flex items-center gap-3", isLast ? "" : "md:flex-1")}
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                reached
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {reached ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span
              className={cn(
                "text-xs font-medium whitespace-nowrap",
                reached ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
            {isLast ? null : (
              <span
                aria-hidden="true"
                className={cn(
                  "hidden h-px flex-1 md:mx-3 md:block",
                  index < currentIndex ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
