import { CreateSessionDto } from '@checkout/session/DTO/create-session.dto'
import { ItemDto } from '@checkout/session/DTO/item.dto'
import { ShippingDto } from '@checkout/session/DTO/shipping.dto'
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

  createShippingDto(): ShippingDto {
    return plainToClass(ShippingDto, {
      zipCode: faker.address.zipCode()
    })
  }

  createSessionDto(shipping: ShippingDto, items: ItemDto[]): CreateSessionDto {
    return plainToClass(CreateSessionDto, {
      shipping,
      items
    })
  }
}
