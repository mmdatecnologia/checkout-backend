import { ShoppingDto } from '@checkout/shopping/DTO/shopping.dto'
import { plainToClass } from 'class-transformer'
import * as faker from 'faker-br'

export class ShoppingFactoryDto {
  shoppingDto(): ShoppingDto {
    return plainToClass(ShoppingDto, {
      clientId: faker.random.uuid(),
      clientSecret: faker.random.uuid(),
      baseUrl: faker.internet.url(),
      checkoutCallback: faker.internet.url()
    })
  }
}
