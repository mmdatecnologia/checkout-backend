import { AppEntity } from '@checkout/app/app.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Index } from 'typeorm'

@Entity('shopping')
export class ShoppingEntity extends AppEntity {
  @ApiProperty()
  @Column()
  @Index()
  clientId: string

  @ApiProperty()
  @Column()
  clientSecret: string

  @ApiProperty()
  @Column()
  baseUrl: string

  @ApiProperty()
  @Column()
  checkoutCallback: string
}
