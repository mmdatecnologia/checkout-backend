import { ShoppingEntity } from '@checkout/modules/shopping/entity/shopping.entity'
import { ShoppingController } from '@checkout/modules/shopping/shopping.controller'
import { ShoppingService } from '@checkout/modules/shopping/shopping.service'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongoMemoryServer } from 'mongodb-memory-server'

// TODO remove this unnecessary file
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
              url: await mongod.getUri(),
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
      const shopping = await shoppingController.createShopping({
        clientId: 123,
        baseUrl: 'http://teste.com.br'
      })

      const consulta = await shoppingController.getShopping(shopping.secretId)

      expect(shopping.secretId).toEqual(consulta.secretId)
      expect(shopping.baseUrl).toEqual(consulta.baseUrl)
      expect(shopping.secretId).toEqual(consulta.secretId)
    })
  })
})
