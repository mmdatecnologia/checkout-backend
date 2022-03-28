import { ItemDto } from '@checkout/session/DTO/item.dto'
import { SessionDto } from '@checkout/session/DTO/session.dto'
import { plainToClass } from 'class-transformer'
import * as faker from 'faker-br'

export class SessionFactoryDto {
  createItemDto(type: 'food' | 'good'): ItemDto {
    return plainToClass(ItemDto, {
      id: faker.random.number(),
      title: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      food: type === 'food',
      quantity: faker.random.number(),
      description: faker.commerce.productAdjective(),
      size: {
        height: faker.random.number(),
        length: faker.random.number(),
        width: faker.random.number()
      },
      store: faker.random.number()
    })
  }

  createSessionDto(items: ItemDto[]): SessionDto {
    return plainToClass(SessionDto, {
      client: {
        clientId: faker.random.uuid(),
        clientSecret: faker.random.uuid(),
        baseUrl: faker.internet.url(),
        callback: faker.internet.url()
      },
      items
    })
  }
}
