import { httpClient } from "@/lib/axios-client";
import type { PaymentResult } from "@/types";

import type { PaymentMethodTokenValue } from "../types";

export function buildIdempotencyKey(
  orderReference: string,
  attempt: number,
): string {
  return `PAY-${orderReference}-${String(attempt).padStart(3, "0")}`;
}

export async function createPayment(input: {
  orderId: string;
  idempotencyKey: string;
  paymentMethodToken: PaymentMethodTokenValue;
}): Promise<PaymentResult> {
  const { data } = await httpClient.post<PaymentResult>("/payments", input);
  return data;
}

export async function retryPayment(
  paymentId: string,
  paymentMethodToken: PaymentMethodTokenValue,
): Promise<PaymentResult> {
  const { data } = await httpClient.post<PaymentResult>(
    `/payments/${encodeURIComponent(paymentId)}/retry`,
    { paymentMethodToken },
  );

  return data;
}
