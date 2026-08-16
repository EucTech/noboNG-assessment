"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import {
  PAYMENT_METHOD_OPTIONS,
  type PaymentMethodTokenValue,
} from "../types";

export function PaymentMethodPicker({
  value,
  onChange,
  disabled,
}: {
  value: PaymentMethodTokenValue;
  onChange: (token: PaymentMethodTokenValue) => void;
  disabled?: boolean;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onChange(next as PaymentMethodTokenValue)}
      disabled={disabled}
      className="gap-2"
    >
      {PAYMENT_METHOD_OPTIONS.map((option) => (
        <Label
          key={option.token}
          htmlFor={option.token}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
            value === option.token
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40",
            disabled ? "cursor-not-allowed opacity-60" : "",
          )}
        >
          <RadioGroupItem value={option.token} id={option.token} className="mt-0.5" />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{option.label}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {option.description}
            </span>
          </span>
        </Label>
      ))}
    </RadioGroup>
  );
}
