import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ShoppingDto {
  @ApiProperty()
  @IsNotEmpty()
  clientId: number

  @ApiProperty()
  @IsNotEmpty()
  baseUrl: string
}

export class ShoppingDtoResponse extends ShoppingDto {
  @ApiProperty()
  secretId: string
}
