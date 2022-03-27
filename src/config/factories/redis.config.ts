import { CacheModuleOptions } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'

export const redisConfig = async (configService: ConfigService): Promise<CacheModuleOptions> => {
  if (configService.get<string>('cache.store') === 'redis') {
    return {
      store: redisStore,
      host: configService.get<string>('cache.host'),
      port: configService.get<string>('cache.port'),
      ttl: configService.get<number>('cache.ttl'),
      password: configService.get<string>('cache.password'),
      prefix: configService.get<string>('cache.prefix')
    }
  } else {
    return null
  }
}
