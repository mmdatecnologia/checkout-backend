import { ApiProperty } from '@nestjs/swagger'
import { IsArray, ValidateNested } from 'class-validator'

import { ClientDto } from './client.dto'
import { ItemDto } from './item.dto'
import { ShippingDto } from './shipping.dto'

export class SessionDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  client: ClientDto

  @ApiProperty({ type: ShippingDto })
  @ValidateNested({ each: true })
  shipping: ShippingDto

  @ApiProperty({ type: [ItemDto] })
  @ValidateNested({ each: true })
  @IsArray()
  items: ItemDto[]
}
