import { Injectable } from '@nestjs/common'
import { MongoRepository } from 'typeorm'
import { ShoppingEntity } from './entity/shopping.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ShoppingDto, ShoppingDtoResponse } from './DTO/shopping.dto'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(ShoppingEntity)
    private readonly shoppingRepository: MongoRepository<ShoppingEntity>
  ) {}

  async create(input: ShoppingDto): Promise<ShoppingDtoResponse> {
    const data = await this.shoppingRepository.save({
      _id: Buffer.from(uuidv4()).toString('base64'),
      clientId: input.clientId,
      baseUrl: input.baseUrl
    })
    return {
      ...input,
      secretId: data._id
    }
  }

  async checkClientSecret(id: string, clientId: number): Promise<ShoppingEntity | null> {
    const shopping = await this.shoppingRepository.findOne({ _id: id })
    if (shopping) {
      if (shopping.clientId === clientId) {
        return shopping
      }
    }
    return null
  }

  async get(id: string): Promise<ShoppingDtoResponse> {
    const data = await this.shoppingRepository.findOne({ _id: id })

    return {
      secretId: data._id,
      clientId: data.clientId,
      baseUrl: data.baseUrl
    }
  }
}
