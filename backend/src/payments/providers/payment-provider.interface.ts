export const PAYMENT_PROVIDER = Symbol('PAYMENT_PROVIDER');

export interface ChargeRequest {
  orderReference: string;
  amountCents: number;
  currency: string;
  paymentMethodToken: string;
  idempotencyKey: string;
}

export interface ChargeResult {
  success: boolean;
  providerReference: string;
  failureReason?: string;
}

export interface PaymentProvider {
  readonly name: string;
  charge(request: ChargeRequest): Promise<ChargeResult>;
}
