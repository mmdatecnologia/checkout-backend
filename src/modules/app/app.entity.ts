import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity('entity')
export class AppEntity {
  @ObjectIdColumn()
  @Transform(({ obj }) => obj.id.toString())
  @IsNotEmpty()
  @Exclude()
  _id: ObjectID

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  createdAt: Date

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  updatedAt: Date

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  @Exclude()
  deletedAt: Date
}
