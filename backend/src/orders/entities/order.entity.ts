import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerEntity {
  @ApiProperty({ example: 'cmsv32ods00003s7d0ksawz95' })
  id!: string;

  @ApiProperty({ example: 'Uche Ezeibe' })
  name!: string;

  @ApiProperty({ example: 'uche@example.com' })
  email!: string;

  @ApiProperty({ example: '+2348012345678' })
  phone!: string;

  @ApiProperty({ example: '12 Adeola Odeku Street, Victoria Island' })
  addressLine!: string;

  @ApiProperty({ example: 'Lagos' })
  city!: string;

  @ApiProperty({ example: 'Lagos' })
  state!: string;

  @ApiProperty({ example: 'Nigeria' })
  country!: string;
}

export class OrderItemEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  orderId!: string;

  @ApiProperty()
  productId!: string;

  @ApiProperty({ example: 'Nike Air Max 270' })
  productName!: string;

  @ApiProperty({ example: 'https://images.pexels.com/photos/5560288/pexels-photo-5560288.jpeg' })
  productImage!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({
    description:
      'The price at the moment of purchase, kept so later price changes cannot rewrite history.',
    example: 12000,
  })
  unitPriceCents!: number;

  @ApiProperty({ example: 24000 })
  lineTotalCents!: number;
}

export class PaymentEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  orderId!: string;

  @ApiProperty({ example: 'PAY-NBO-10001-001' })
  idempotencyKey!: string;

  @ApiProperty({ example: 1 })
  attempt!: number;

  @ApiProperty({ enum: ['PENDING', 'SUCCEEDED', 'FAILED'], example: 'SUCCEEDED' })
  status!: string;

  @ApiProperty({ example: 26500 })
  amountCents!: number;

  @ApiProperty({ example: 'USD' })
  currency!: string;

  @ApiProperty({ example: 'mock' })
  provider!: string;

  @ApiPropertyOptional({ nullable: true, example: 'mock_9f2c1d84-1f0c-4a2f-9a3e-0b7c1d3e5f61' })
  providerReference!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example: 'The card was declined by the issuing bank.',
  })
  failureReason!: string | null;

  @ApiProperty()
  createdAt!: Date;
}

export class ShipmentEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  orderId!: string;

  @ApiProperty({
    description: 'Set to pending_assignment until a real courier integration takes over.',
    example: 'pending_assignment',
  })
  provider!: string;

  @ApiPropertyOptional({ nullable: true })
  trackingNumber!: string | null;

  @ApiProperty({ enum: ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'], example: 'PENDING' })
  status!: string;

  @ApiPropertyOptional({ nullable: true, example: '2026-08-30T00:00:00.000Z' })
  estimatedDelivery!: Date | null;
}

export class OrderSummaryEntity {
  @ApiProperty({ example: 'cmsv3m3ce0007mo7d6bn72ygd' })
  id!: string;

  @ApiProperty({ example: 'NBO-10001' })
  reference!: string;

  @ApiProperty({
    enum: [
      'PENDING_PAYMENT',
      'PAID',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
      'PAYMENT_FAILED',
    ],
    example: 'PROCESSING',
  })
  status!: string;

  @ApiProperty({ example: 26500 })
  totalCents!: number;

  @ApiProperty({ example: 'USD' })
  currency!: string;

  @ApiProperty({ example: 3, description: 'Total number of units across all items.' })
  itemCount!: number;

  @ApiPropertyOptional({
    nullable: true,
    example: 'https://images.pexels.com/photos/5560288/pexels-photo-5560288.jpeg',
  })
  previewImage!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'Nike Air Max 270' })
  previewProductName!: string | null;

  @ApiPropertyOptional({ nullable: true, example: '2026-08-16T01:00:12.000Z' })
  paidAt!: Date | null;

  @ApiProperty()
  createdAt!: Date;
}

export class OrderEntity {
  @ApiProperty({ example: 'cmsv3m3ce0007mo7d6bn72ygd' })
  id!: string;

  @ApiProperty({
    description: 'The customer facing reference, also accepted by GET /orders/:id.',
    example: 'NBO-10001',
  })
  reference!: string;

  @ApiProperty()
  customerId!: string;

  @ApiProperty({ type: CustomerEntity })
  customer!: CustomerEntity;

  @ApiProperty({
    enum: [
      'PENDING_PAYMENT',
      'PAID',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
      'PAYMENT_FAILED',
    ],
    example: 'PROCESSING',
  })
  status!: string;

  @ApiProperty({ description: 'Calculated by the server from database prices.', example: 24000 })
  subtotalCents!: number;

  @ApiProperty({ example: 2500 })
  shippingCents!: number;

  @ApiProperty({ example: 26500 })
  totalCents!: number;

  @ApiProperty({ example: 'USD' })
  currency!: string;

  @ApiProperty({ type: [OrderItemEntity] })
  items!: OrderItemEntity[];

  @ApiProperty({ type: [PaymentEntity], description: 'Every attempt, oldest first.' })
  payments!: PaymentEntity[];

  @ApiPropertyOptional({ type: ShipmentEntity, nullable: true })
  shipment!: ShipmentEntity | null;

  @ApiPropertyOptional({ nullable: true, example: '2026-08-16T01:00:12.000Z' })
  paidAt!: Date | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
