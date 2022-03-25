import { forwardRef, Module } from '@nestjs/common'
import { SessionController } from './session.controller'
import { CacheRedisModule } from '../cache/cache.redis.module'
import { SessionService } from './session.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  controllers: [SessionController],
  imports: [forwardRef(() => CacheRedisModule), forwardRef(() => AuthModule)],
  providers: [SessionService]
})
export class SessionModule {}
