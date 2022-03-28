import { LocalAuthGuard } from '@checkout/auth/local-auth.guard'
import { SessionDto } from '@checkout/session/DTO/session.dto'
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { SessionService } from './session.service'

@ApiTags('Session')
@Controller('session')
@UseGuards(LocalAuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async set(@Body() req: SessionDto): Promise<string> {
    return this.sessionService.set(req)
  }

  @Get()
  @ApiResponse({ type: [SessionDto] })
  async get(@Query('key') key: string): Promise<SessionDto> {
    return this.sessionService.get(key)
  }
}
