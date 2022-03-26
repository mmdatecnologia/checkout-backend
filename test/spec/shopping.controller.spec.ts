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
        secretId: '123',
        callback: 'http://teste.com.br/callback',
        _id: '123'
      })

      const consulta = await shoppingController.getShopping(shopping._id)

      expect(shopping._id).toEqual(consulta._id)
      expect(shopping.callback).toEqual(consulta.callback)
      expect(shopping.secretId).toEqual(consulta.secretId)
    })
  })
})
