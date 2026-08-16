import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class FindOrdersQueryDto {
  @ApiProperty({
    example: 'uche@example.com',
    description: 'Returns every order placed with this email address.',
  })
  @IsEmail()
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email!: string;
}
