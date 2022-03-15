import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator'

export class ShippingDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  distance: number
}
