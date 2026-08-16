import { ApiProperty } from '@nestjs/swagger';

export class PricingRulesEntity {
  @ApiProperty({ example: 'USD' })
  currency!: string;

  @ApiProperty({
    description:
      'Subtotals below this value pay the standard rate, at or above it pay the consolidated rate.',
    example: 10000,
  })
  shippingThresholdCents!: number;

  @ApiProperty({ example: 1500 })
  standardShippingCents!: number;

  @ApiProperty({ example: 2500 })
  consolidatedShippingCents!: number;

  @ApiProperty({ example: 20 })
  maxQuantityPerItem!: number;
}
