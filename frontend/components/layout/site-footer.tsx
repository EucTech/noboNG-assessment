import Link from "next/link";

import { Logo } from "@/components/common/logo";

const LINK_GROUPS = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/cart", label: "Your Cart" },
      { href: "/checkout", label: "Checkout" },
      { href: "/orders", label: "Your Orders" },
    ],
  },
  {
    title: "How It Works",
    links: [
      { href: "/products", label: "Browse international stores" },
      { href: "/cart", label: "We buy on your behalf" },
      { href: "/products", label: "Consolidated delivery to Nigeria" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Shop products from international stores and have them consolidated
            and delivered to your door in Nigeria.
          </p>
        </div>

        {LINK_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{group.title}</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Support</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>support@nobong.example</li>
            <li>Mon - Fri, 9am - 6pm WAT</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} NoboNG. All rights reserved.</p>
          <p>Payments on this build are simulated. No card details are stored.</p>
        </div>
      </div>
    </footer>
  );
}
