import { ApiProperty } from '@nestjs/swagger';
import { OrderEntity, PaymentEntity } from '../../orders/entities/order.entity';

export class PaymentResultEntity {
  @ApiProperty({ type: PaymentEntity })
  payment!: PaymentEntity;

  @ApiProperty({ type: OrderEntity })
  order!: OrderEntity;

  @ApiProperty({
    description:
      'True when this idempotency key had already been settled, so the stored result was returned without charging again.',
    example: false,
  })
  replayed!: boolean;
}
