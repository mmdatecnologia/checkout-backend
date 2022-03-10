import { ApiProperty } from '@nestjs/swagger'
import { FreteDto } from './frete.dto'
import { ItemDto } from './item.dto'

export class SessionDto {
  @ApiProperty()
  loja: string

  @ApiProperty()
  frete: FreteDto

  @ApiProperty()
  itens: ItemDto
}
