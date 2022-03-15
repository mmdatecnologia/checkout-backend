import { SessionDto } from '@checkout/modules/session/DTO/session.dto'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SessionService } from './session.service'

@ApiTags('Session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async set(@Body() req: SessionDto): Promise<string> {
    return await this.sessionService.set(req)
  }
}
