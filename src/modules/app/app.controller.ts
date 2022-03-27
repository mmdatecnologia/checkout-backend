import { Controller, Get } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { AppService } from './app.service'

@ApiTags('Root Route')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'A hello word string' })
  getHello(): string {
    return this.appService.getHello()
  }
}
