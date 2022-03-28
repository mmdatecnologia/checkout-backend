import { ShoppingModule } from '@checkout/shopping/shopping.module'
import { forwardRef, Module } from '@nestjs/common'

import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'

@Module({
  imports: [forwardRef(() => ShoppingModule)],
  providers: [AuthService, LocalAuthGuard],
  exports: [AuthService]
})
export class AuthModule {}
