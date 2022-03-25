import { Injectable } from '@nestjs/common'
import { MongoRepository } from 'typeorm'
import { ShoppingEntity } from './entity/shopping.entity'
import * as uuid from 'uuid'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(ShoppingEntity)
    private readonly shoppingRepository: MongoRepository<ShoppingEntity>
  ) {}

  async create(input: ShoppingEntity): Promise<ShoppingEntity> {
    input._id = Buffer.from(uuid.v4()).toString('base64')
    return await this.shoppingRepository.save(input)
  }

  async checkClientSecret(id: string, secretId: string): Promise<ShoppingEntity | null> {
    const shopping = await this.get(id)
    if (shopping) {
      if (shopping.secretId === secretId) {
        return shopping
      }
    }
    return null
  }

  async get(id: string): Promise<ShoppingEntity> {
    return await this.shoppingRepository.findOne({ _id: id })
  }
}
