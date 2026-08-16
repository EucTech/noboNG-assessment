import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { ShipmentsModule } from '../shipments/shipments.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MockPaymentProvider } from './providers/mock-payment.provider';
import { PAYMENT_PROVIDER } from './providers/payment-provider.interface';

@Module({
  imports: [OrdersModule, ShipmentsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, { provide: PAYMENT_PROVIDER, useClass: MockPaymentProvider }],
  exports: [PaymentsService],
})
export class PaymentsModule {}
