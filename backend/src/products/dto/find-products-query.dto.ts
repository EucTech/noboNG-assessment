import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class FindProductsQueryDto {
  @ApiPropertyOptional({
    example: 'headphones',
    description: 'Matches name, description or category.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  search?: string;

  @ApiPropertyOptional({ example: 'Audio' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  category?: string;

  @ApiPropertyOptional({ enum: ['newest', 'price_asc', 'price_desc', 'rating'], example: 'rating' })
  @IsOptional()
  @IsIn(['newest', 'price_asc', 'price_desc', 'rating'])
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating';

  @ApiPropertyOptional({ example: 24, minimum: 1, maximum: 50, default: 24 })
  @IsOptional()
  @Transform(({ value }: TransformFnParams): number => Number(value))
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
