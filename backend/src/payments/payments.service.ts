import { Inject, Injectable, Logger } from '@nestjs/common';
import { OrderStatus, Payment, PaymentStatus } from '../database/prisma-client';
import { PrismaService } from '../database/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { ShipmentsService } from '../shipments/shipments.service';
import { ORDER_DETAIL_INCLUDE, OrderWithDetails } from '../orders/orders.types';
import { PrismaErrorCode, isPrismaKnownRequestError } from '../common/errors/prisma-error.guard';
import {
  OrderNotFoundException,
  OrderNotPayableException,
  PaymentDeclinedException,
  PaymentInProgressException,
  PaymentNotFoundException,
} from '../common/errors/domain.exception';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RetryPaymentDto } from './dto/retry-payment.dto';
import { PAYMENT_PROVIDER } from './providers/payment-provider.interface';
import type { PaymentProvider } from './providers/payment-provider.interface';

export interface PaymentResult {
  payment: Payment;
  order: OrderWithDetails;
  replayed: boolean;
}

const PAYABLE_STATUSES: OrderStatus[] = [OrderStatus.PENDING_PAYMENT, OrderStatus.PAYMENT_FAILED];

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly orders: OrdersService,
    private readonly shipments: ShipmentsService,
    @Inject(PAYMENT_PROVIDER) private readonly provider: PaymentProvider,
  ) {}

  async process(dto: CreatePaymentDto): Promise<PaymentResult> {
    const replay = await this.findReplay(dto.idempotencyKey);

    if (replay) {
      return replay;
    }

    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });

    if (!order) {
      throw new OrderNotFoundException(dto.orderId);
    }

    if (!this.isPayable(order.status)) {
      throw new OrderNotPayableException(order.status);
    }

    if (!dto.idempotencyKey.startsWith(`PAY-${order.reference}-`)) {
      throw new OrderNotPayableException(order.status);
    }

    const attempt = this.parseAttempt(dto.idempotencyKey);

    let pending: Payment;

    try {
      pending = await this.prisma.payment.create({
        data: {
          orderId: order.id,
          idempotencyKey: dto.idempotencyKey,
          attempt,
          status: PaymentStatus.PENDING,
          amountCents: order.totalCents,
          currency: order.currency,
          provider: this.provider.name,
        },
      });
    } catch (error) {
      if (isPrismaKnownRequestError(error) && error.code === PrismaErrorCode.UNIQUE_CONSTRAINT) {
        const raced = await this.findReplay(dto.idempotencyKey);

        if (raced) {
          return raced;
        }

        throw new PaymentInProgressException(dto.idempotencyKey);
      }

      throw error;
    }

    const charge = await this.provider.charge({
      orderReference: order.reference,
      amountCents: order.totalCents,
      currency: order.currency,
      paymentMethodToken: dto.paymentMethodToken,
      idempotencyKey: dto.idempotencyKey,
    });

    if (!charge.success) {
      const failed = await this.prisma.$transaction(async (tx) => {
        const updated = await tx.payment.update({
          where: { id: pending.id },
          data: {
            status: PaymentStatus.FAILED,
            providerReference: charge.providerReference,
            failureReason: charge.failureReason,
          },
        });

        await this.orders.markPaymentFailed(tx, order.id);

        return updated;
      });

      this.logger.warn(`Payment ${failed.idempotencyKey} failed: ${failed.failureReason}`);

      throw this.declined(failed, order.reference);
    }

    const settled = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id: pending.id },
        data: {
          status: PaymentStatus.SUCCEEDED,
          providerReference: charge.providerReference,
          failureReason: null,
        },
      });

      await this.orders.markPaid(tx, order.id);
      await this.orders.reserveStock(tx, order.id);
      await this.shipments.createForOrder(tx, order.id);
      await this.orders.markProcessing(tx, order.id);

      return updated;
    });

    this.logger.log(`Payment ${settled.idempotencyKey} succeeded for order ${order.reference}`);

    return {
      payment: settled,
      order: await this.orders.findById(order.id),
      replayed: false,
    };
  }

  async retry(paymentId: string, dto: RetryPaymentDto): Promise<PaymentResult> {
    const previous = await this.prisma.payment.findUnique({ where: { id: paymentId } });

    if (!previous) {
      throw new PaymentNotFoundException(paymentId);
    }

    const order = await this.prisma.order.findUnique({ where: { id: previous.orderId } });

    if (!order) {
      throw new OrderNotFoundException(previous.orderId);
    }

    if (!this.isPayable(order.status)) {
      throw new OrderNotPayableException(order.status);
    }

    const attempts = await this.prisma.payment.count({ where: { orderId: order.id } });

    return this.process({
      orderId: order.id,
      idempotencyKey: this.buildIdempotencyKey(order.reference, attempts + 1),
      paymentMethodToken: dto.paymentMethodToken,
    });
  }

  buildIdempotencyKey(orderReference: string, attempt: number): string {
    return `PAY-${orderReference}-${attempt.toString().padStart(3, '0')}`;
  }

  private async findReplay(idempotencyKey: string): Promise<PaymentResult | null> {
    const existing = await this.prisma.payment.findUnique({
      where: { idempotencyKey },
      include: { order: { include: ORDER_DETAIL_INCLUDE } },
    });

    if (!existing) {
      return null;
    }

    if (existing.status === PaymentStatus.PENDING) {
      throw new PaymentInProgressException(idempotencyKey);
    }

    const { order, ...payment } = existing;

    if (payment.status === PaymentStatus.FAILED) {
      throw this.declined(payment, order.reference, true);
    }

    this.logger.log(`Replayed idempotent payment ${idempotencyKey}`);

    return { payment, order, replayed: true };
  }

  private declined(
    payment: Payment,
    orderReference: string,
    replayed = false,
  ): PaymentDeclinedException {
    return new PaymentDeclinedException(payment.failureReason ?? 'The payment was declined.', {
      paymentId: payment.id,
      orderId: payment.orderId,
      orderReference,
      attempt: payment.attempt,
      nextIdempotencyKey: this.buildIdempotencyKey(orderReference, payment.attempt + 1),
      replayed,
    });
  }

  private isPayable(status: OrderStatus): boolean {
    return PAYABLE_STATUSES.includes(status);
  }

  private parseAttempt(idempotencyKey: string): number {
    return Number(idempotencyKey.slice(idempotencyKey.lastIndexOf('-') + 1));
  }
}
