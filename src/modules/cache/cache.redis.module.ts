import { redisConfig } from '@checkout/config/factories/redis.config'
import { CacheModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { CacheRedisService } from './cache.redis.service'

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: redisConfig
    })
  ],
  exports: [CacheRedisService],
  providers: [CacheRedisService]
})
export class CacheRedisModule {}
