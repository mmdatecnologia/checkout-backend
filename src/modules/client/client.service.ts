import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { Client } from './entity/client.entity'
import * as uuid from 'uuid'
import { createHash } from 'crypto'

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
    client.secretId = createHash('sha256').update(uuid.v4()).digest('hex')
    client.callback = 'https://cliente01/callback'
    return await this.clientRepository.save(client)
  }
}
