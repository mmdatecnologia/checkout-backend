import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ShoppingService } from '../shopping/shopping.service'

@Injectable()
export class AuthService {
  constructor(private readonly shoppingService: ShoppingService) {}

  async validate(clientId: string, secretId: string): Promise<void> {
    const data = await this.shoppingService.checkClientSecret(clientId, secretId)
    if (data === null) throw new UnauthorizedException()
  }
}
