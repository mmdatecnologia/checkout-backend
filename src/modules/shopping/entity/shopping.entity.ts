import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity('shopping')
export class ShoppingEntity {
  @ApiProperty()
  @ObjectIdColumn()
  @IsNotEmpty()
  _id: string

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  clientId: number

  @ApiProperty()
  @Column()
  baseUrl: string
}
