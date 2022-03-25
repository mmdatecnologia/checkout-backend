import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity('shopping')
export class ShoppingEntity {
  @ObjectIdColumn()
  _id: string

  @Column()
  secretId: string

  @Column()
  callback: string
}
