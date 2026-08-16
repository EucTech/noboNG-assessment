import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ErrorCode } from '../errors/error-codes';

export class ErrorResponseEntity {
  @ApiProperty({ example: 409 })
  statusCode!: number;

  @ApiProperty({ enum: Object.values(ErrorCode), example: ErrorCode.PRODUCT_UNAVAILABLE })
  code!: string;

  @ApiProperty({
    description: 'A message safe to show directly to the customer.',
    example: 'Garmin Forerunner 265 Running Watch is currently out of stock and cannot be ordered.',
  })
  message!: string;

  @ApiPropertyOptional({
    description:
      'Field-level validation messages, or structured context such as the next idempotency key.',
    example: ['customer.phone must be a valid Nigerian phone number, for example +2348012345678'],
  })
  details?: unknown;

  @ApiProperty({ example: '/api/orders' })
  path!: string;

  @ApiProperty({ example: '2026-08-16T00:48:29.355Z' })
  timestamp!: string;
}
