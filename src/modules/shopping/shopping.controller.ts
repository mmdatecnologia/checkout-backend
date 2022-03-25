import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ShoppingEntity } from './entity/shopping.entity'
import { ShoppingService } from './shopping.service'

@ApiTags('Shopping')
@Controller('shopping')
export class ShoppingController {
  constructor(private readonly shoppingSercvice: ShoppingService) {}

  @Post()
  async createShopping(@Body() body: ShoppingEntity): Promise<ShoppingEntity> {
    return await this.shoppingSercvice.create({
      _id: '123',
      secretId: '123',
      callback: '123'
    })
  }

  @Get()
  async getShopping(@Query('key') key: string): Promise<ShoppingEntity> {
    return await this.shoppingSercvice.get(key)
  }
}
