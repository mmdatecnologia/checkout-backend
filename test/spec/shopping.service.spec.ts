import { ShoppingEntity } from '@checkout/shopping/entity/shopping.entity'
import { ShoppingController } from '@checkout/shopping/shopping.controller'
import { ShoppingService } from '@checkout/shopping/shopping.service'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongoMemoryServer } from 'mongodb-memory-server'

describe('ShoppingService', () => {
  let shoppingService: ShoppingService
  let mongod: MongoMemoryServer
  let app: TestingModule

  afterAll(async () => {
    if (mongod) await mongod.stop()
    await app.close()
  })

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create()
            return {
              name: 'default',
              type: 'mongodb',
              url: mongod.getUri(),
              entities: [ShoppingEntity],
              synchronize: true,
              useNewUrlParser: true,
              logging: true
            }
          }
        }),
        TypeOrmModule.forFeature([ShoppingEntity])
      ],
      controllers: [ShoppingController],
      providers: [ShoppingService]
    }).compile()

    shoppingService = app.get<ShoppingService>(ShoppingService)
  })

  describe('root', () => {
    it('CreateShopping"', async () => {
      const createdShopping = await shoppingService.create({
        clientId: 123,
        baseUrl: 'http://teste.com.br/callback'
      })

      const shopping = await shoppingService.get(createdShopping.secretId)

      expect(createdShopping.secretId).toEqual(shopping.secretId)
      expect(createdShopping.baseUrl).toEqual(shopping.baseUrl)
      expect(createdShopping.secretId).toEqual(shopping.secretId)
    })

    it('CheckSecret"', async () => {
      const createdShopping = await shoppingService.create({
        clientId: 1234,
        baseUrl: 'http://teste.com.br/callback'
      })

      const shopping = await shoppingService.checkClientSecret(createdShopping.secretId, createdShopping.clientId)

      expect(createdShopping.secretId).toEqual(shopping._id)
      expect(createdShopping.baseUrl).toEqual(shopping.baseUrl)
      expect(createdShopping.clientId).toEqual(shopping.clientId)
    })
  })
})
