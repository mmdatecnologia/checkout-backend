import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsUUID, ValidateNested } from 'class-validator'
import { ItemDto } from './item.dto'
import { ShippingDto } from './shipping.dto'

export class SessionDto {
  @ApiProperty()
  @IsUUID(4)
  store: string

  @ApiProperty({ type: ShippingDto })
  @ValidateNested({ each: true })
  @Type(() => ShippingDto)
  @Optional()
  shipping: ShippingDto

  @ApiProperty({ type: [ItemDto] })
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  @IsArray()
  items: ItemDto[]
}
