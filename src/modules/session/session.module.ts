import { AuthModule } from '@checkout/auth/auth.module'
import { CacheRedisModule } from '@checkout/cache/cache.redis.module'
import { forwardRef, Module } from '@nestjs/common'

import { SessionController } from './session.controller'
import { SessionService } from './session.service'

@Module({
  imports: [forwardRef(() => CacheRedisModule), forwardRef(() => AuthModule)],
  providers: [SessionService],
  controllers: [SessionController]
})
export class SessionModule {}
