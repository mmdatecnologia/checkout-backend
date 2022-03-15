import { SessionDto } from '@checkout/modules/session/DTO/session.dto'
import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { SessionService } from './session.service'

@ApiTags('Session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async set(@Body() req: SessionDto): Promise<string> {
    return await this.sessionService.set(req)
  }

  @Get()
  @ApiResponse({ type: [SessionDto] })
  async get(@Query('key') key: string): Promise<SessionDto> {
    return await this.sessionService.get(key)
  }
}
