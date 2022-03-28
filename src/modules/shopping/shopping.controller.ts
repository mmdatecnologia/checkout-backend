import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ShoppingDto, ShoppingDtoResponse } from './DTO/shopping.dto'
import { ShoppingService } from './shopping.service'

@ApiTags('Shopping')
@Controller('shopping')
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @Post()
  async createShopping(@Body() req: ShoppingDto): Promise<ShoppingDtoResponse> {
    const createdShopping = await this.shoppingService.create(req)
    return Object.assign(new ShoppingDtoResponse(), createdShopping)
  }
}
