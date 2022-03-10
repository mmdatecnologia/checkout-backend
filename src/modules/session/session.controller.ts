import { SessionDto } from '@checkout/modules/session/DTO/session.dto'
import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CacheService } from '../cache/cache.service'
import { v4 as uuidv4 } from 'uuid'

@ApiTags('Session')
@Controller('session')
export class SessionController {
  constructor(private readonly cacheService: CacheService) {}

  @Post()
  async set(@Body() req: SessionDto): Promise<string> {
    const key: string = Buffer.from(uuidv4()).toString('base64')
    await this.cacheService.set(key, req)
    return key
  }

  @Get()
  @ApiResponse({ type: [SessionDto] })
  async get(@Query('key') key: string): Promise<SessionDto> {
    return await this.cacheService.get<SessionDto>(key)
  }
}
