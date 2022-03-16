import { forwardRef, Module } from '@nestjs/common'
import { SessionController } from './session.controller'
import { CacheRedisModule } from '../cache/cache.redis.module'
import { SessionService } from './session.service'

@Module({
  controllers: [SessionController],
  imports: [forwardRef(() => CacheRedisModule)],
  providers: [SessionService]
})
export class SessionModule {}
