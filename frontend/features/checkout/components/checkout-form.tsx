"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import {
  checkoutSchema,
  NIGERIAN_STATES,
  type CheckoutCustomer,
  type CheckoutFormValues,
} from "../validation/checkout.schema";

export function CheckoutForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (values: CheckoutCustomer) => void;
  submitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues, unknown, CheckoutCustomer>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "Lagos",
    },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
    >
      <div>
        <h2 className="text-base font-semibold">Delivery Details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We deliver to addresses within Nigeria.
        </p>
      </div>

      <Field
        id="name"
        label="Full name"
        error={errors.name?.message}
        autoComplete="name"
        placeholder="Uche Ezeibe"
        {...register("name")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="email"
          label="Email address"
          type="email"
          error={errors.email?.message}
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
        <Field
          id="phone"
          label="Phone number"
          type="tel"
          error={errors.phone?.message}
          autoComplete="tel"
          placeholder="+234 801 234 5678"
          {...register("phone")}
        />
      </div>

      <Field
        id="addressLine"
        label="Street address"
        error={errors.addressLine?.message}
        autoComplete="street-address"
        placeholder="12 Adeola Odeku Street, Victoria Island"
        {...register("addressLine")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="city"
          label="City"
          error={errors.city?.message}
          autoComplete="address-level2"
          placeholder="Lagos"
          {...register("city")}
        />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="state">State</Label>
          <select
            id="state"
            aria-invalid={errors.state ? true : undefined}
            className={cn(
              "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none",
              "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25",
              "aria-invalid:border-destructive",
            )}
            {...register("state")}
          >
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state?.message ? (
            <p className="text-xs text-destructive">{errors.state.message}</p>
          ) : null}
        </div>
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="sm:w-fit">
        {submitting ? <Loader2 className="animate-spin" /> : null}
        {submitting ? "Confirming order..." : "Continue to Payment"}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  className,
  ref,
  ...props
}: React.ComponentProps<"input"> & { id: string; label: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={className}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
