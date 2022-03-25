import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsUUID, Min, ValidateNested } from 'class-validator'
import { SizeDto } from './size.dto'

export class ItemDto {
  @ApiProperty()
  @IsUUID(4)
  id: string

  @ApiProperty()
  @IsNotEmpty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty()
  food: boolean = false

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => SizeDto)
  size: SizeDto

  @ApiProperty()
  @Min(1)
  quantity: number

  @ApiProperty()
  @IsNumber()
  price: number
}
