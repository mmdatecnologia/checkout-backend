import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'

import { ClientDto } from './client.dto'
import { ItemDto } from './item.dto'

export class SessionDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ClientDto)
  client: ClientDto

  // @ApiProperty({ type: ShippingDto })
  // @ValidateNested({ each: true })
  // @Type(() => ShippingDto)
  // @Optional()
  // shipping: ShippingDto

  @ApiProperty({ type: [ItemDto] })
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  @IsArray()
  items: ItemDto[]
}
