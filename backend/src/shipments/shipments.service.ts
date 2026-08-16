import { Injectable } from '@nestjs/common';
import { Prisma } from '../database/prisma-client';
import { LOGISTICS_PROVIDER_PENDING } from '../logistics/logistics.constants';

const DEFAULT_DELIVERY_DAYS = 14;

@Injectable()
export class ShipmentsService {
  async createForOrder(tx: Prisma.TransactionClient, orderId: string): Promise<void> {
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + DEFAULT_DELIVERY_DAYS);

    await tx.shipment.upsert({
      where: { orderId },
      create: {
        orderId,
        provider: LOGISTICS_PROVIDER_PENDING,
        status: 'PENDING',
        estimatedDelivery,
      },
      update: {},
    });
  }
}
