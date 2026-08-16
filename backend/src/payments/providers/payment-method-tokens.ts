export const PaymentMethodToken = {
  SUCCESS: 'tok_test_success',
  DECLINED: 'tok_test_declined',
  INSUFFICIENT_FUNDS: 'tok_test_insufficient_funds',
  NETWORK_ERROR: 'tok_test_network_error',
  RANDOM: 'tok_test_random',
} as const;

export type PaymentMethodTokenValue = (typeof PaymentMethodToken)[keyof typeof PaymentMethodToken];

export const PAYMENT_METHOD_TOKENS = Object.values(PaymentMethodToken);

export const FAILURE_REASONS: Record<string, string> = {
  [PaymentMethodToken.DECLINED]: 'The card was declined by the issuing bank.',
  [PaymentMethodToken.INSUFFICIENT_FUNDS]: 'There are not enough funds on this card.',
  [PaymentMethodToken.NETWORK_ERROR]: 'The payment network did not respond in time.',
};
