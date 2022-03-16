import { AppService } from '@checkout/app.service'
import { Controller, Get } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

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
