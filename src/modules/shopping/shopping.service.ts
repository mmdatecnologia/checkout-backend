import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'

import { ShoppingDto } from './DTO/shopping.dto'
import { ShoppingEntity } from './entity/shopping.entity'

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(ShoppingEntity)
    private readonly shoppingRepository: MongoRepository<ShoppingEntity>
  ) {}

  async create(input: ShoppingDto): Promise<ShoppingEntity> {
    const shopping = Object.assign(new ShoppingEntity(), input, {
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await this.shoppingRepository.save(shopping)
    return shopping
  }

  async checkClientSecret(clientId: string, clientSecret: string): Promise<ShoppingEntity | null> {
    const shopping = await this.shoppingRepository.findOne({ clientId })
    if (shopping) {
      if (shopping.clientSecret === clientSecret) {
        return shopping
      }
    }
    return null
  }

  async get(clientId: string, clientSecret: string): Promise<ShoppingEntity | undefined> {
    return this.shoppingRepository.findOne({ clientId, clientSecret })
  }
}
