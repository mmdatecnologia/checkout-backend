import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set(key: string, value: unknown): Promise<void> {
    await this.cacheManager.set(key, value)
  }

  async get<T>(key: string): Promise<T> {
    return await this.cacheManager.get(key)
  }
}
