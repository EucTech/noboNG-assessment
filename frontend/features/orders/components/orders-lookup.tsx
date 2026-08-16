"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Loader2, PackageSearch, Search } from "lucide-react";
import { z } from "zod";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api-client";

import { fetchOrdersByEmail } from "../services/orders.service";
import { OrderSummaryCard } from "./order-summary-card";

const lookupSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

type LookupValues = z.infer<typeof lookupSchema>;

export function OrdersLookup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LookupValues>({
    resolver: zodResolver(lookupSchema),
    defaultValues: { email: "" },
  });

  const lookup = useMutation({
    mutationFn: ({ email }: LookupValues) => fetchOrdersByEmail(email),
  });

  const errorMessage = lookup.isError
    ? lookup.error instanceof ApiError
      ? lookup.error.message
      : "We could not look up your orders. Please try again."
    : null;

  return (
    <div className="flex flex-col gap-6">
      <form
        noValidate
        onSubmit={handleSubmit((values) => lookup.mutate(values))}
        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email?.message ? (
            <p id="email-error" className="text-xs text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" disabled={lookup.isPending} className="sm:w-fit">
          {lookup.isPending ? <Loader2 className="animate-spin" /> : <Search />}
          {lookup.isPending ? "Searching..." : "Find my orders"}
        </Button>
      </form>

      {errorMessage ? (
        <ErrorState title="Unable to look up orders" description={errorMessage} />
      ) : null}

      {lookup.isSuccess && lookup.data.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No orders found"
          description={`We could not find any orders placed with ${lookup.variables?.email}.`}
        />
      ) : null}

      {lookup.isSuccess && lookup.data.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {lookup.data.map((order) => (
            <OrderSummaryCard key={order.id} order={order} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
