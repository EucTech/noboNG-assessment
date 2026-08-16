"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
] as const;

export function ProductFilters({
  categories,
  activeCategory,
  activeSort,
}: {
  categories: string[];
  activeCategory?: string;
  activeSort?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildHref = useCallback(
    (key: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      const serialised = params.toString();
      return serialised ? `${pathname}?${serialised}` : pathname;
    },
    [pathname, searchParams],
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <CategoryPill href={buildHref("category")} active={!activeCategory}>
          All
        </CategoryPill>
        {categories.map((category) => (
          <CategoryPill
            key={category}
            href={buildHref("category", category)}
            active={activeCategory === category}
          >
            {category}
          </CategoryPill>
        ))}
      </div>

      <label className="flex shrink-0 items-center gap-2 text-sm">
        <span className="text-muted-foreground">Sort</span>
        <select
          value={activeSort ?? "newest"}
          onChange={(event) => router.push(buildHref("sort", event.target.value))}
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function CategoryPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-foreground hover:border-primary hover:text-primary",
      )}
    >
      {children}
    </Link>
  );
}
