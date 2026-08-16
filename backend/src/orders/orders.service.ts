import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '../database/prisma-client';
import { PrismaService } from '../database/prisma.service';
import { CustomersService } from '../customers/customers.service';
import { PricingService } from '../pricing/pricing.service';
import { CURRENCY } from '../pricing/pricing.constants';
import {
  EmptyCartException,
  InsufficientStockException,
  OrderNotFoundException,
  ProductNotFoundException,
  ProductUnavailableException,
} from '../common/errors/domain.exception';
import { CreateOrderDto, OrderItemInputDto } from './dto/create-order.dto';
import { ORDER_DETAIL_INCLUDE, OrderWithDetails } from './orders.types';
import { OrderSummaryEntity } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customers: CustomersService,
    private readonly pricing: PricingService,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderWithDetails> {
    const items = this.mergeDuplicateItems(dto.items);

    if (items.length === 0) {
      throw new EmptyCartException();
    }

    return this.prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: items.map((item) => item.productId) } },
      });

      const productsById = new Map(products.map((product) => [product.id, product]));

      const lines = items.map((item) => {
        const product = productsById.get(item.productId);

        if (!product) {
          throw new ProductNotFoundException(item.productId);
        }

        if (product.availability === 'OUT_OF_STOCK' || product.stockQuantity <= 0) {
          throw new ProductUnavailableException(product.name);
        }

        if (product.stockQuantity < item.quantity) {
          throw new InsufficientStockException(product.name, product.stockQuantity);
        }

        return {
          productId: product.id,
          productName: product.name,
          productImage: product.imageUrl,
          quantity: item.quantity,
          unitPriceCents: product.priceCents,
          lineTotalCents: product.priceCents * item.quantity,
        };
      });

      const breakdown = this.pricing.calculate(lines);
      const customer = await this.customers.upsertFromCheckout(tx, dto.customer);
      const reference = await this.nextOrderReference(tx);

      return tx.order.create({
        data: {
          reference,
          customerId: customer.id,
          status: OrderStatus.PENDING_PAYMENT,
          subtotalCents: breakdown.subtotalCents,
          shippingCents: breakdown.shippingCents,
          totalCents: breakdown.totalCents,
          currency: CURRENCY,
          items: { createMany: { data: lines } },
        },
        include: ORDER_DETAIL_INCLUDE,
      });
    });
  }

  async findByEmail(email: string): Promise<OrderSummaryEntity[]> {
    const orders = await this.prisma.order.findMany({
      where: { customer: { email } },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    return orders.map((order) => ({
      id: order.id,
      reference: order.reference,
      status: order.status,
      totalCents: order.totalCents,
      currency: order.currency,
      itemCount: order.items.reduce((count, item) => count + item.quantity, 0),
      previewImage: order.items[0]?.productImage ?? null,
      previewProductName: order.items[0]?.productName ?? null,
      paidAt: order.paidAt,
      createdAt: order.createdAt,
    }));
  }

  async findById(id: string): Promise<OrderWithDetails> {
    const order = await this.prisma.order.findFirst({
      where: { OR: [{ id }, { reference: id }] },
      include: ORDER_DETAIL_INCLUDE,
    });

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    return order;
  }

  async markPaid(tx: Prisma.TransactionClient, orderId: string): Promise<void> {
    await tx.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAID, paidAt: new Date() },
    });
  }

  async markProcessing(tx: Prisma.TransactionClient, orderId: string): Promise<void> {
    await tx.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PROCESSING },
    });
  }

  async markPaymentFailed(tx: Prisma.TransactionClient, orderId: string): Promise<void> {
    await tx.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAYMENT_FAILED },
    });
  }

  async reserveStock(tx: Prisma.TransactionClient, orderId: string): Promise<void> {
    const items = await tx.orderItem.findMany({ where: { orderId } });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }

    await tx.product.updateMany({
      where: { id: { in: items.map((item) => item.productId) }, stockQuantity: { lte: 0 } },
      data: { availability: 'OUT_OF_STOCK' },
    });
  }

  private mergeDuplicateItems(items: OrderItemInputDto[]): OrderItemInputDto[] {
    const merged = new Map<string, OrderItemInputDto>();

    for (const item of items) {
      const existing = merged.get(item.productId);
      merged.set(
        item.productId,
        existing
          ? { productId: item.productId, quantity: existing.quantity + item.quantity }
          : { ...item },
      );
    }

    return [...merged.values()];
  }

  private async nextOrderReference(tx: Prisma.TransactionClient): Promise<string> {
    const rows = await tx.$queryRaw<
      { nextval: bigint }[]
    >`SELECT nextval('order_reference_seq') AS nextval`;

    return `NBO-${rows[0].nextval.toString()}`;
  }
}
