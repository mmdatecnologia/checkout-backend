import { forwardRef, Module } from '@nestjs/common'
import { ShoppingModule } from '../shopping/shopping.module'
import { AuthService } from './auth.service'

@Module({
  imports: [forwardRef(() => ShoppingModule)],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
