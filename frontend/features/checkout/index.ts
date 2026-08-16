export { CheckoutView } from "./components/checkout-view";
export { CheckoutForm } from "./components/checkout-form";
export { OrderSummaryPanel } from "./components/order-summary-panel";
export { createOrder } from "./services/checkout.service";
export {
  checkoutSchema,
  NIGERIAN_PHONE_PATTERN,
  NIGERIAN_STATES,
} from "./validation/checkout.schema";
export type {
  CheckoutCustomer,
  CheckoutFormValues,
} from "./validation/checkout.schema";
