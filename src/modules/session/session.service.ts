import { Injectable } from '@nestjs/common'
import { CacheRedisService } from '../cache/cache.redis.service'
import { SessionDto } from './DTO/session.dto'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class SessionService {
  constructor(private readonly cacheService: CacheRedisService) {}

  async set(req: SessionDto): Promise<string> {
    const key: string = Buffer.from(uuidv4()).toString('base64')
    await this.cacheService.set(key, req)
    return key
  }

  async get(key: string): Promise<SessionDto> {
    return await this.cacheService.get<SessionDto>(key)
  }
}
