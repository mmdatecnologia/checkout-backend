import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

import { AuthService } from './auth.service'

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const headers = context.switchToHttp().getRequest().headers
    const shopping = await this.authService.validate(headers.clientid, headers.clientsecret)
    if (!shopping) {
      throw new UnauthorizedException()
    }
    return true
  }
}
