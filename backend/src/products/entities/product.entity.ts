import { ApiProperty } from '@nestjs/swagger';

export class ProductEntity {
  @ApiProperty({ example: 'cmsv32ods00003s7d0ksawz95' })
  id!: string;

  @ApiProperty({ example: 'nike-air-max-270' })
  slug!: string;

  @ApiProperty({ example: 'Nike Air Max 270' })
  name!: string;

  @ApiProperty({
    example:
      'The Air Max 270 pairs the tallest Air unit Nike has ever put in a lifestyle shoe with a stretchy bootie upper.',
  })
  description!: string;

  @ApiProperty({
    description: 'Price in minor units. 12000 is $120.00.',
    example: 12000,
  })
  priceCents!: number;

  @ApiProperty({ example: 'USD' })
  currency!: string;

  @ApiProperty({ example: 'https://images.pexels.com/photos/5560288/pexels-photo-5560288.jpeg' })
  imageUrl!: string;

  @ApiProperty({ example: 'Footwear' })
  category!: string;

  @ApiProperty({ enum: ['IN_STOCK', 'LIMITED_STOCK', 'OUT_OF_STOCK'], example: 'IN_STOCK' })
  availability!: string;

  @ApiProperty({ example: 42 })
  stockQuantity!: number;

  @ApiProperty({ example: 7 })
  deliveryMinDays!: number;

  @ApiProperty({ example: 14 })
  deliveryMaxDays!: number;

  @ApiProperty({ example: 4.6 })
  rating!: number;

  @ApiProperty({ example: 1284 })
  ratingCount!: number;

  @ApiProperty({ example: '2026-08-16T00:20:11.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-16T00:20:11.000Z' })
  updatedAt!: Date;
}
