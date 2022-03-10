import { ApiProperty } from '@nestjs/swagger'

export class ItemDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  titulo: string

  @ApiProperty()
  descricao: string

  @ApiProperty()
  dimensao: string

  @ApiProperty()
  quantidade: number

  @ApiProperty()
  valorUnitario: number
}
