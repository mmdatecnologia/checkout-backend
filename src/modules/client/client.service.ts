import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { Client } from './entity/client.entity'
import * as uuid from 'uuid'

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: MongoRepository<Client>
  ) {}

  async create(input: Client): Promise<Client> {
    console.log('input', input)
    const client = new Client()
    client._id = Buffer.from(uuid.v4()).toString('base64')
    client.secretId = uuid.v4()
    return await this.clientRepository.save(client)
  }
}
