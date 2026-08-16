export type ProductAvailability = "IN_STOCK" | "LIMITED_STOCK" | "OUT_OF_STOCK";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "PAYMENT_FAILED";

export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED";

export type ShipmentStatus = "PENDING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  imageUrl: string;
  category: string;
  availability: ProductAvailability;
  stockQuantity: number;
  deliveryMinDays: number;
  deliveryMaxDays: number;
  rating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface Payment {
  id: string;
  orderId: string;
  idempotencyKey: string;
  attempt: number;
  status: PaymentStatus;
  amountCents: number;
  currency: string;
  provider: string;
  providerReference: string | null;
  failureReason: string | null;
  createdAt: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  provider: string;
  trackingNumber: string | null;
  status: ShipmentStatus;
  estimatedDelivery: string | null;
}

export interface Order {
  id: string;
  reference: string;
  customerId: string;
  customer: Customer;
  status: OrderStatus;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
  items: OrderItem[];
  payments: Payment[];
  shipment: Shipment | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  id: string;
  reference: string;
  status: OrderStatus;
  totalCents: number;
  currency: string;
  itemCount: number;
  previewImage: string | null;
  previewProductName: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface PricingRules {
  currency: string;
  shippingThresholdCents: number;
  standardShippingCents: number;
  consolidatedShippingCents: number;
  maxQuantityPerItem: number;
}

export interface PaymentResult {
  payment: Payment;
  order: Order;
  replayed: boolean;
}
