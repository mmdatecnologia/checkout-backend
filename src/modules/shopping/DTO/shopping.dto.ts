import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class ShoppingDto {
  @ApiProperty()
  @IsNotEmpty()
  clientId: string

  @ApiProperty()
  @IsNotEmpty()
  clientSecret: string

  @ApiProperty()
  @IsNotEmpty()
  baseUrl: string

  @ApiProperty()
  @IsNotEmpty()
  checkoutCallback: string
}

export class ShoppingDtoResponse extends ShoppingDto {
  @ApiProperty()
  @Transform(({ obj }) => obj.id.toString())
  id: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
