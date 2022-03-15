import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity()
export class Client {
  @ObjectIdColumn()
  _id: string

  @Column()
  secretId: string

  @Column()
  callback: string
}
