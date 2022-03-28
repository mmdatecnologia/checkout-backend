import * as typeOrmConfig from '@checkout/config/factories/typeorm.config'
import { Db, MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

export class MemoryDb {
  private server: MongoMemoryServer
  private client: MongoClient
  db: Db

  async initialize(): Promise<void> {
    this.server = await MongoMemoryServer.create()

    this.client = await MongoClient.connect(this.server.getUri())
    this.db = this.client.db('jest')
    this.mockTypeOrmConfig()
  }

  async cleanup(): Promise<void> {
    await this.ensureInitialized()
    const collections = await this.db.collections()
    await Promise.all(collections.map(async (collection) => collection.deleteMany({})))
  }

  async shutdown(): Promise<void> {
    await this.client?.close()
    await this.server?.stop()
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.server || !this.client || !this.db) {
      await this.initialize()
    }
  }

  private mockTypeOrmConfig(): void {
    jest.spyOn(typeOrmConfig, 'typeOrmConfigNoSQL').mockImplementation(async () => ({
      type: 'mongodb',
      url: this.server.getUri(),
      entities: [__dirname + '../**/*.entity.ts'],
      synchronize: true,
      autoLoadEntities: true,
      useUnifiedTopology: true,
      keepConnectionAlive: true,
      useNewUrlParser: true,
      logging: true
    }))
  }
}
