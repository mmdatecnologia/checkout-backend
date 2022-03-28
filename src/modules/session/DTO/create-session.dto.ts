import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'

import { ItemDto } from './item.dto'
import { ShippingDto } from './shipping.dto'

export class CreateSessionDto {
  @ApiProperty({ type: ShippingDto })
  @Type(() => ShippingDto)
  @ValidateNested({ each: true })
  shipping: ShippingDto

  @ApiProperty({ type: [ItemDto] })
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  @IsArray()
  items: ItemDto[]
}
