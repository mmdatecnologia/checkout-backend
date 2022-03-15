import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ClientService } from './client.service'
import { Client } from './entity/client.entity'

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async createCliente(@Body() body: Client): Promise<Client> {
    console.log('client', body)
    return await this.clientService.create(body)
  }
}
