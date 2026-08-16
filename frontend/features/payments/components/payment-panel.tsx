"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Lock, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ApiError, ApiErrorCode } from "@/lib/api-client";
import { formatMoney } from "@/lib/format";
import type { Order } from "@/types";

import { PaymentMethodPicker } from "./payment-method-picker";
import {
  buildIdempotencyKey,
  createPayment,
  retryPayment,
} from "../services/payments.service";
import {
  PaymentMethodToken,
  type PaymentDeclineDetails,
  type PaymentMethodTokenValue,
} from "../types";

function toDeclineDetails(details: unknown): PaymentDeclineDetails | null {
  if (typeof details !== "object" || details === null) {
    return null;
  }

  const candidate = details as Partial<PaymentDeclineDetails>;

  return typeof candidate.paymentId === "string" &&
    typeof candidate.nextIdempotencyKey === "string"
    ? (candidate as PaymentDeclineDetails)
    : null;
}

export function PaymentPanel({
  order,
  onSuccess,
}: {
  order: Order;
  onSuccess: (order: Order) => void;
}) {
  const [token, setToken] = useState<PaymentMethodTokenValue>(
    PaymentMethodToken.SUCCESS,
  );
  const [submitting, setSubmitting] = useState(false);
  const [decline, setDecline] = useState<PaymentDeclineDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePay = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const result = decline
        ? await retryPayment(decline.paymentId, token)
        : await createPayment({
            orderId: order.id,
            idempotencyKey: buildIdempotencyKey(order.reference, 1),
            paymentMethodToken: token,
          });

      onSuccess(result.order);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);

        if (error.code === ApiErrorCode.PAYMENT_DECLINED) {
          setDecline(toDeclineDetails(error.details));
        }
      } else {
        setErrorMessage("The payment could not be completed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
      <div>
        <h2 className="text-base font-semibold">Payment</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Order{" "}
          <span className="font-medium text-foreground">{order.reference}</span>{" "}
          is reserved and awaiting payment of{" "}
          <span className="font-medium text-foreground tabular-nums">
            {formatMoney(order.totalCents, order.currency)}
          </span>
          .
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-surface p-3 text-xs text-muted-foreground">
        <Lock className="mt-0.5 size-3.5 shrink-0 text-primary" />
        <span>
          This is a simulated gateway. No card number, CVV or payment credential
          is ever collected or stored. Pick an outcome below to exercise the flow.
        </span>
      </div>

      <PaymentMethodPicker
        value={token}
        onChange={setToken}
        disabled={submitting}
      />

      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/5 p-3"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="text-sm">
            <p className="font-medium text-destructive">Payment failed</p>
            <p className="mt-0.5 text-muted-foreground">{errorMessage}</p>
            {decline ? (
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                attempt {decline.attempt} - next key {decline.nextIdempotencyKey}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <Separator />

      <Button size="lg" onClick={handlePay} disabled={submitting}>
        {submitting ? (
          <Loader2 className="animate-spin" />
        ) : decline ? (
          <RotateCcw />
        ) : null}
        {submitting
          ? "Processing payment..."
          : decline
            ? "Retry Payment"
            : `Pay ${formatMoney(order.totalCents, order.currency)}`}
      </Button>
    </div>
  );
}
