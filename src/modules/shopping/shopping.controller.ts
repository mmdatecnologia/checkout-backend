import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ShoppingDto, ShoppingDtoResponse } from './DTO/shopping.dto'
import { ShoppingService } from './shopping.service'

@ApiTags('Shopping')
@Controller('shopping')
export class ShoppingController {
  constructor(private readonly shoppingSercvice: ShoppingService) {}

  @Post()
  async createShopping(@Body() req: ShoppingDto): Promise<ShoppingDtoResponse> {
    return await this.shoppingSercvice.create(req)
  }

  @Get()
  async getShopping(@Query('key') key: string): Promise<ShoppingDtoResponse> {
    return await this.shoppingSercvice.get(key)
  }
}
