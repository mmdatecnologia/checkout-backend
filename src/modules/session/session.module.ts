import { CacheModule, Module } from '@nestjs/common'
import { SessionController } from './session.controller'
import * as redisStore from 'cache-manager-redis-store'
import { CacheService } from '../cache/cache.service'

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          host: 'localhost',
          port: 6379,
          ttl: 60 * 3600 * 3600
        }
      }
    })
  ],
  controllers: [SessionController],
  providers: [CacheService]
})
export class SessionModule {}
