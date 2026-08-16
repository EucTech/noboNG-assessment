"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";

import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { useCartItemCount } from "@/features/cart";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const itemCount = useCartItemCount();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="NoboNG home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          >
            <Link href="/cart" className="relative">
              <ShoppingCart className="size-4" />
              {itemCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
