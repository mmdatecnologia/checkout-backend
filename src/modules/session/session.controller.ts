import { AuthService } from '@checkout/auth/auth.service'
import { SessionDto } from '@checkout/session/DTO/session.dto'
import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common'
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger'

import { SessionService } from './session.service'

interface HeaderData {
  id: string
  clientId: number
}

@ApiTags('Session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService, private readonly authService: AuthService) {}

  @Post()
  @ApiHeader({
    name: 'secretId',
    description: 'Some custom header',
    required: false
  })
  @ApiHeader({
    name: 'secretId',
    description: 'Some custom header',
    required: false
  })
  async set(@Body() req: SessionDto, @Headers() { id, clientId }: HeaderData): Promise<string> {
    await this.authService.validate(id, clientId)
    return this.sessionService.set(req)
  }

  @Get()
  @ApiResponse({ type: [SessionDto] })
  async get(@Query('key') key: string): Promise<SessionDto> {
    return this.sessionService.get(key)
  }
}
