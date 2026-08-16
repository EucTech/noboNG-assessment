import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Matches, MaxLength } from 'class-validator';
import { PAYMENT_METHOD_TOKENS } from '../providers/payment-method-tokens';

export const IDEMPOTENCY_KEY_PATTERN = /^PAY-NBO-\d+-\d{3}$/;

export class CreatePaymentDto {
  @ApiProperty({ example: 'cmsv3m3ce0007mo7d6bn72ygd' })
  @IsString()
  orderId!: string;

  @ApiProperty({
    example: 'PAY-NBO-10001-001',
    description:
      'PAY-{orderReference}-{attempt}. Unique in the database, so replaying a settled key returns the stored result instead of charging again.',
  })
  @IsString()
  @MaxLength(64)
  @Matches(IDEMPOTENCY_KEY_PATTERN, {
    message: 'idempotencyKey must follow the PAY-{orderReference}-{attempt} format',
  })
  idempotencyKey!: string;

  @ApiProperty({
    enum: PAYMENT_METHOD_TOKENS,
    example: 'tok_test_success',
    description: 'Simulation token that selects the outcome. No real card data is ever accepted.',
  })
  @IsIn(PAYMENT_METHOD_TOKENS, {
    message: 'paymentMethodToken must be one of the supported simulation tokens',
  })
  paymentMethodToken!: string;
}
