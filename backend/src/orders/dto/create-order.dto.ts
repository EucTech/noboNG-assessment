import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CustomerDetailsDto } from '../../customers/dto/customer-details.dto';
import { MAX_ITEMS_PER_ORDER, MAX_QUANTITY_PER_ITEM } from '../../pricing/pricing.constants';

export class OrderItemInputDto {
  @ApiProperty({ example: 'cmsv32ods00003s7d0ksawz95' })
  @IsString()
  productId!: string;

  @ApiProperty({ example: 2, minimum: 1, maximum: MAX_QUANTITY_PER_ITEM })
  @IsInt()
  @Min(1)
  @Max(MAX_QUANTITY_PER_ITEM)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: [OrderItemInputDto],
    description:
      'Product ids and quantities only. Prices are read from the database, and sending unitPriceCents or totalCents is rejected with 400.',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(MAX_ITEMS_PER_ORDER)
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items!: OrderItemInputDto[];

  @ApiProperty({ type: CustomerDetailsDto })
  @ValidateNested()
  @Type(() => CustomerDetailsDto)
  customer!: CustomerDetailsDto;
}
