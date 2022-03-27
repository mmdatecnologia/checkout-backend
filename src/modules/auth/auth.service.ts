import { ShoppingService } from '@checkout/shopping/shopping.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthService {
  constructor(private readonly shoppingService: ShoppingService) {}

  async validate(id: string, clientId: number): Promise<void> {
    const data = await this.shoppingService.checkClientSecret(id, clientId)
    if (data === null) throw new UnauthorizedException()
  }
}
