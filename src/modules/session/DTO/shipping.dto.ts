import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ShippingDto {
  @ApiProperty()
  @IsNotEmpty()
  zipCode: string
}
