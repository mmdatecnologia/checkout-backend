import { LocalAuthGuard } from '@checkout/auth/local-auth.guard'
import { Body, Controller, Get, Headers, Post, Query, UseGuards } from '@nestjs/common'
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateSessionDto } from './DTO/create-session.dto'
import { SessionDto } from './DTO/session.dto'
import { SessionService } from './session.service'

@ApiTags('Session')
@Controller('session')
@UseGuards(LocalAuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @ApiHeader({
    name: 'clientSecret',
    description: 'Some custom header',
    required: true
  })
  @ApiHeader({
    name: 'clientId',
    description: 'Some custom header',
    required: true
  })
  async set(@Body() req: CreateSessionDto, @Headers() headers: any): Promise<string> {
    const { shipping, items } = req
    const { clientid: clientId, clientsecret: clientSecret } = headers
    const session = Object.assign(new SessionDto(), {
      client: {
        clientId,
        clientSecret
      },
      shipping,
      items
    })
    return this.sessionService.set(session)
  }

  @Get()
  @ApiHeader({
    name: 'clientSecret',
    description: 'Some custom header',
    required: false
  })
  @ApiHeader({
    name: 'clientId',
    description: 'Some custom header',
    required: false
  })
  @ApiResponse({ type: [SessionDto] })
  async get(@Query('key') key: string): Promise<SessionDto> {
    return this.sessionService.get(key)
  }
}
