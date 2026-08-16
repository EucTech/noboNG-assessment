export const PaymentMethodToken = {
  SUCCESS: "tok_test_success",
  DECLINED: "tok_test_declined",
  INSUFFICIENT_FUNDS: "tok_test_insufficient_funds",
  NETWORK_ERROR: "tok_test_network_error",
  RANDOM: "tok_test_random",
} as const;

export type PaymentMethodTokenValue =
  (typeof PaymentMethodToken)[keyof typeof PaymentMethodToken];

export interface PaymentMethodOption {
  token: PaymentMethodTokenValue;
  label: string;
  description: string;
  outcome: "success" | "failure" | "random";
}

export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  {
    token: PaymentMethodToken.SUCCESS,
    label: "Test card - approved",
    description: "Always completes successfully and creates the order.",
    outcome: "success",
  },
  {
    token: PaymentMethodToken.DECLINED,
    label: "Test card - declined",
    description: "Always declined by the issuing bank so you can retry.",
    outcome: "failure",
  },
  {
    token: PaymentMethodToken.INSUFFICIENT_FUNDS,
    label: "Test card - insufficient funds",
    description: "Fails with an insufficient funds response.",
    outcome: "failure",
  },
  {
    token: PaymentMethodToken.RANDOM,
    label: "Test card - unpredictable",
    description: "Randomly approves or declines, like a live gateway.",
    outcome: "random",
  },
];

export interface PaymentDeclineDetails {
  paymentId: string;
  orderId: string;
  orderReference: string;
  attempt: number;
  nextIdempotencyKey: string;
  replayed: boolean;
}
