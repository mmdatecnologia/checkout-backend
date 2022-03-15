import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity()
export class Client {
  @ObjectIdColumn()
  @ApiProperty()
  _id: string

  @Column()
  @ApiProperty()
  secretId: string

  @Column()
  @ApiProperty()
  clientId: string
}
