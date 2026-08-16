import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

const NIGERIAN_PHONE = /^(?:\+?234|0)[789][01]\d{8}$/;

const trim = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CustomerDetailsDto {
  @ApiProperty({ example: 'Uche Ezeibe', minLength: 2, maxLength: 80 })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  @Transform(trim)
  name!: string;

  @ApiProperty({ example: 'uche@example.com', description: 'Normalised to lower case.' })
  @IsEmail()
  @MaxLength(160)
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email!: string;

  @ApiProperty({
    example: '+2348012345678',
    description: 'Nigerian mobile number. Spaces and dashes are stripped before validation.',
  })
  @IsString()
  @Matches(NIGERIAN_PHONE, {
    message: 'phone must be a valid Nigerian phone number, for example +2348012345678',
  })
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.replace(/[\s-]/g, '') : value,
  )
  phone!: string;

  @ApiProperty({ example: '12 Adeola Odeku Street, Victoria Island' })
  @IsString()
  @MinLength(5)
  @MaxLength(160)
  @Transform(trim)
  addressLine!: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  @Transform(trim)
  city!: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  @Transform(trim)
  state!: string;

  @ApiPropertyOptional({ example: 'Nigeria', default: 'Nigeria' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  @Transform(trim)
  country?: string;
}
