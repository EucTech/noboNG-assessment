import { CreditCard, Headset, RefreshCw, Truck } from "lucide-react";

const VALUES = [
  {
    icon: Truck,
    title: "Transparent shipping",
    description: "One flat rate per order, shown before you pay.",
  },
  {
    icon: CreditCard,
    title: "One secure checkout",
    description: "Pay once in USD, no foreign card juggling.",
  },
  {
    icon: RefreshCw,
    title: "Retry-safe payments",
    description: "A declined card never double-charges you.",
  },
  {
    icon: Headset,
    title: "Local support",
    description: "A Nigeria-based team you can actually reach.",
  },
];

export function ValueStrip() {
  return (
    <section className="container-page pt-10">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value) => (
          <li
            key={value.title}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <value.icon className="size-4 text-primary" />
            </span>
            <div>
              <p className="text-sm font-medium">{value.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {value.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
