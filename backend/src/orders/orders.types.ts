import { Prisma } from '../database/prisma-client';

export const ORDER_DETAIL_INCLUDE = {
  customer: true,
  items: true,
  payments: { orderBy: { attempt: 'asc' } },
  shipment: true,
} satisfies Prisma.OrderInclude;

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: typeof ORDER_DETAIL_INCLUDE;
}>;

export const RETRYABLE_ORDER_STATUSES = ['PENDING_PAYMENT', 'PAYMENT_FAILED'] as const;
