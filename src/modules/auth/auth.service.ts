import { ShoppingEntity } from '@checkout/shopping/entity/shopping.entity'
import { ShoppingService } from '@checkout/shopping/shopping.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthService {
  constructor(private readonly shoppingService: ShoppingService) {}

  async validate(clientId: string, clientSecret: string): Promise<ShoppingEntity> {
    const data = await this.shoppingService.checkClientSecret(clientId, clientSecret)
    if (data === null) throw new UnauthorizedException()
    return data
  }
}
