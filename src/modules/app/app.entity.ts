import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity('entity')
export class AppEntity {
  @ObjectIdColumn()
  @ApiProperty({ type: 'string' })
  id: ObjectID

  @ApiProperty()
  @Column()
  createdAt: Date

  @ApiProperty()
  @Column()
  updatedAt: Date

  @ApiProperty()
  @Column()
  deletedAt: Date
}
