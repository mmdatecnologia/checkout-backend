import { ApiProperty } from '@nestjs/swagger'
import { IsPositive } from 'class-validator'

export class SizeDto {
  @ApiProperty()
  @IsPositive()
  width: number

  @ApiProperty()
  @IsPositive()
  height: number

  @ApiProperty()
  @IsPositive()
  length: number
}
