import { ApiProperty } from '@nestjs/swagger'

export class FreteDto {
  @ApiProperty()
  distanciaMaxima: number
}
