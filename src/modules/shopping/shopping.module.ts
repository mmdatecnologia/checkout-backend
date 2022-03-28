import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShoppingEntity } from './entity/shopping.entity'
import { ShoppingController } from './shopping.controller'
import { ShoppingService } from './shopping.service'

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingEntity])],
  controllers: [ShoppingController],
  exports: [ShoppingService],
  providers: [ShoppingService]
})
export class ShoppingModule {}
