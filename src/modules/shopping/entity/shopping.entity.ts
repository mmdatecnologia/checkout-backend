import { AppEntity } from '@checkout/app/app.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { Column, Entity, Index } from 'typeorm'

@Entity('shopping')
export class ShoppingEntity extends AppEntity {
  @ApiProperty()
  @Column()
  @IsNotEmpty()
  @Index()
  clientId: string

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  @Exclude()
  clientSecret: string

  @ApiProperty()
  @Column()
  baseUrl: string
}
