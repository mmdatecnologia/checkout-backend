import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { ItemDto } from './item.dto'

export class SessionDto {
  @ApiProperty()
  @IsNotEmpty()
  store: number

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
