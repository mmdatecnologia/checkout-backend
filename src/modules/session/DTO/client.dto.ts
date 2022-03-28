import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ClientDto {
  @ApiProperty()
  @IsNotEmpty()
  clientId: string

  @ApiProperty()
  @IsNotEmpty()
  clientSecret: string
}
