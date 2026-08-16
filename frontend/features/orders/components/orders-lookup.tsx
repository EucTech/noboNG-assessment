"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, PackageSearch, Search } from "lucide-react";
import { z } from "zod";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api-client";
import type { OrderSummary } from "@/types";

import { fetchOrdersByEmail } from "../services/orders.service";
import { OrderSummaryCard } from "./order-summary-card";

const lookupSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

type LookupValues = z.infer<typeof lookupSchema>;

export function OrdersLookup() {
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);
  const [searchedEmail, setSearchedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LookupValues>({
    resolver: zodResolver(lookupSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: LookupValues) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const results = await fetchOrdersByEmail(email);
      setOrders(results);
      setSearchedEmail(email);
    } catch (error) {
      setOrders(null);
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "We could not look up your orders. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
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

        <Button type="submit" disabled={loading} className="sm:w-fit">
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          {loading ? "Searching..." : "Find my orders"}
        </Button>
      </form>

      {errorMessage ? (
        <ErrorState title="Unable to look up orders" description={errorMessage} />
      ) : null}

      {orders && orders.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No orders found"
          description={`We could not find any orders placed with ${searchedEmail}.`}
        />
      ) : null}

      {orders && orders.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderSummaryCard key={order.id} order={order} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
