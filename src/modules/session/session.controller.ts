import { SessionDto } from '@checkout/modules/session/DTO/session.dto'
import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common'
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from '../auth/auth.service'
import { SessionService } from './session.service'

interface HeaderData {
  clientid: string
  secretid: string
}

@ApiTags('Session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService, private readonly authService: AuthService) {}

  @Post()
  @ApiHeader({
    name: 'clientid',
    description: 'Some custom header',
    required: false
  })
  @ApiHeader({
    name: 'secretid',
    description: 'Some custom header',
    required: false
  })
  async set(@Body() req: SessionDto, @Headers() { clientid, secretid }: HeaderData): Promise<string> {
    await this.authService.validate(clientid, secretid)
    return await this.sessionService.set(req)
  }

  @Get()
  @ApiResponse({ type: [SessionDto] })
  async get(@Query('key') key: string): Promise<SessionDto> {
    return await this.sessionService.get(key)
  }
}
