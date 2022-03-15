import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'
import { CacheRedisService } from './cache.redis.service'

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        if (configService.get<string>('cache.store') === 'REDIS') {
          return {
            store: redisStore,
            host: configService.get<string>('cache.host'),
            port: 6379,
            ttl: 60 * 3600 * 3600
          }
        } else {
          return null
        }
      }
    })
  ],
  exports: [CacheRedisService],
  providers: [CacheRedisService]
})
export class CacheRedisModule {}
