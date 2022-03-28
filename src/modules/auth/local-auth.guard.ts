import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'

import { AuthService } from './auth.service'

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const headers = context.switchToHttp().getRequest().headers
    try {
      await this.authService.validate(headers.clientid, headers.clientsecret)
      return true
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new UnauthorizedException()
      }
      throw e
    }
  }
}
