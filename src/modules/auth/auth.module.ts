import { ShoppingModule } from '@checkout/shopping/shopping.module'
import { forwardRef, Module } from '@nestjs/common'

import { AuthService } from './auth.service'

@Module({
  imports: [forwardRef(() => ShoppingModule)],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
