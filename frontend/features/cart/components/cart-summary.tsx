import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { CartTotals } from "../types";

export function CartSummary({
  totals,
  currency = "USD",
  title = "Order Summary",
  note,
  children,
  className,
}: {
  totals: CartTotals;
  currency?: string;
  title?: string;
  note?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "h-fit rounded-xl border border-border bg-card p-5",
        className,
      )}
    >
      <h2 className="text-base font-semibold">{title}</h2>

      <dl className="mt-4 flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">
            Subtotal
            <span className="ml-1 text-xs">
              ({totals.itemCount} item{totals.itemCount === 1 ? "" : "s"})
            </span>
          </dt>
          <dd className="tabular-nums">
            {formatMoney(totals.subtotalCents, currency)}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Estimated Shipping</dt>
          <dd className="tabular-nums">
            {formatMoney(totals.shippingCents, currency)}
          </dd>
        </div>

        <Separator />

        <div className="flex items-center justify-between text-base font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">
            {formatMoney(totals.totalCents, currency)}
          </dd>
        </div>
      </dl>

      {note ? (
        <p className="mt-3 text-xs text-muted-foreground">{note}</p>
      ) : null}

      {children ? <div className="mt-5">{children}</div> : null}
    </aside>
  );
}
