import { apiRequest } from "@/lib/api-client";
import type { PaymentResult } from "@/types";

import type { PaymentMethodTokenValue } from "../types";

export function buildIdempotencyKey(
  orderReference: string,
  attempt: number,
): string {
  return `PAY-${orderReference}-${String(attempt).padStart(3, "0")}`;
}

export function createPayment(input: {
  orderId: string;
  idempotencyKey: string;
  paymentMethodToken: PaymentMethodTokenValue;
}): Promise<PaymentResult> {
  return apiRequest<PaymentResult>("/payments", {
    method: "POST",
    body: input,
  });
}

export function retryPayment(
  paymentId: string,
  paymentMethodToken: PaymentMethodTokenValue,
): Promise<PaymentResult> {
  return apiRequest<PaymentResult>(
    `/payments/${encodeURIComponent(paymentId)}/retry`,
    { method: "POST", body: { paymentMethodToken } },
  );
}
