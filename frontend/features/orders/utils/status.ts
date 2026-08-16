import type { OrderStatus } from "@/types";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAID: "Paid",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  PAYMENT_FAILED: "Payment Failed",
};

export const ORDER_STATUS_VARIANT: Record<
  OrderStatus,
  "success" | "warning" | "destructive" | "secondary"
> = {
  PENDING_PAYMENT: "warning",
  PAID: "success",
  PROCESSING: "success",
  SHIPPED: "success",
  DELIVERED: "success",
  CANCELLED: "secondary",
  PAYMENT_FAILED: "destructive",
};

export const ORDER_STATUS_DESCRIPTION: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "We are holding this order until payment is completed.",
  PAID: "Payment confirmed. We are preparing your order.",
  PROCESSING: "We are buying your items and consolidating them for shipping.",
  SHIPPED: "Your parcel is on its way to Nigeria.",
  DELIVERED: "This order has been delivered.",
  CANCELLED: "This order was cancelled.",
  PAYMENT_FAILED: "The last payment attempt was declined. You can try again.",
};

export function isOrderPayable(status: OrderStatus): boolean {
  return status === "PENDING_PAYMENT" || status === "PAYMENT_FAILED";
}
