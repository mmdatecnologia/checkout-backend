import { ShoppingEntity } from '@checkout/shopping/entity/shopping.entity'
import { ShoppingController } from '@checkout/shopping/shopping.controller'
import { ShoppingService } from '@checkout/shopping/shopping.service'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongoMemoryServer } from 'mongodb-memory-server'

describe('ShoppingController', () => {
  let shoppingController: ShoppingController
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

    shoppingController = app.get<ShoppingController>(ShoppingController)
  })

  describe('root', () => {
    it('CreateShopping"', async () => {
      const createdShopping = await shoppingController.createShopping({
        clientId: 123,
        baseUrl: 'http://teste.com.br'
      })

      const shopping = await shoppingController.getShopping(createdShopping.secretId)

      expect(createdShopping.secretId).toEqual(shopping.secretId)
      expect(createdShopping.baseUrl).toEqual(shopping.baseUrl)
      expect(createdShopping.secretId).toEqual(shopping.secretId)
    })
  })
})
