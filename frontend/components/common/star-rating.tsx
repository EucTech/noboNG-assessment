import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  ratingCount,
  className,
}: {
  rating: number;
  ratingCount?: number;
  className?: string;
}) {
  const rounded = Math.round(rating);

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-label={`Rated ${rating} out of 5`}
    >
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            aria-hidden="true"
            className={cn(
              "size-3.5",
              index < rounded
                ? "fill-accent text-accent"
                : "fill-transparent text-muted-foreground/40",
            )}
          />
        ))}
      </span>
      <span className="text-xs text-muted-foreground">
        {rating.toFixed(1)}
        {ratingCount === undefined ? null : ` (${ratingCount.toLocaleString()})`}
      </span>
    </span>
  );
}
