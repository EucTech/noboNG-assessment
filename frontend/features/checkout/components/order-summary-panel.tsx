import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/format";

interface SummaryLine {
  key: string;
  name: string;
  imageUrl: string;
  quantity: number;
  unitPriceCents: number;
}

export function OrderSummaryPanel({
  lines,
  subtotalCents,
  shippingCents,
  totalCents,
  currency = "USD",
  title = "Order Summary",
  note,
}: {
  lines: SummaryLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency?: string;
  title?: string;
  note?: string;
}) {
  return (
    <aside className="h-fit rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24">
      <h2 className="text-base font-semibold">{title}</h2>

      <ul className="mt-4 flex flex-col gap-3">
        {lines.map((line) => (
          <li key={line.key} className="flex items-center gap-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface">
              <Image
                src={line.imageUrl}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {line.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium">{line.name}</p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {formatMoney(line.unitPriceCents, currency)} each
              </p>
            </div>
            <p className="text-sm tabular-nums">
              {formatMoney(line.unitPriceCents * line.quantity, currency)}
            </p>
          </li>
        ))}
      </ul>

      <Separator className="my-4" />

      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums">{formatMoney(subtotalCents, currency)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="tabular-nums">{formatMoney(shippingCents, currency)}</dd>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-base font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatMoney(totalCents, currency)}</dd>
        </div>
      </dl>

      {note ? <p className="mt-3 text-xs text-muted-foreground">{note}</p> : null}
    </aside>
  );
}
