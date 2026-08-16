"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  disabled = false,
  label = "Quantity",
  className,
}: {
  value: number;
  min?: number;
  max: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="rounded-r-none"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        <Minus className="size-3.5" />
      </Button>
      <span
        aria-live="polite"
        className="w-9 text-center font-mono text-sm tabular-nums"
      >
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="rounded-l-none"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}
