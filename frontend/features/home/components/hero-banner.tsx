import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2, PackageCheck, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  { icon: Globe2, label: "Buy from any international store" },
  { icon: PackageCheck, label: "Consolidated at our overseas hub" },
  { icon: ShieldCheck, label: "Protected from checkout to doorstep" },
];

const HERO_IMAGE =
  "https://images.pexels.com/photos/5560288/pexels-photo-5560288.jpeg?auto=compress&cs=tinysrgb&w=1400";

export function HeroBanner() {
  return (
    <section className="container-page pt-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
          <div className="flex flex-col items-start gap-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              Free consolidation on every order
            </span>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Shop the world.
              <br />
              <span className="text-primary">Delivered to Nigeria.</span>
            </h1>

            <p className="max-w-md text-base text-muted-foreground">
              Browse products from international retailers, pay once in one place,
              and let NoboNG handle the buying, consolidation and last mile to
              your door.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/products">
                  Start Shopping
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>

            <ul className="mt-2 flex flex-col gap-2">
              {HIGHLIGHTS.map((highlight) => (
                <li
                  key={highlight.label}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <highlight.icon className="size-4 shrink-0 text-primary" />
                  {highlight.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-border bg-background lg:aspect-square">
            <Image
              src={HERO_IMAGE}
              alt="A pair of sneakers ready for international shipping"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
