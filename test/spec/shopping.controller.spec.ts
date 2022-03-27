import { typeOrmConfigNoSQL } from '@checkout/config/factories/typeorm.config'
import { ShoppingEntity } from '@checkout/shopping/entity/shopping.entity'
import { ShoppingController } from '@checkout/shopping/shopping.controller'
import { ShoppingService } from '@checkout/shopping/shopping.service'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemoryDb } from '@test/mocks/memory-db'

describe('ShoppingController', () => {
  let shoppingController: ShoppingController
  const mongod = new MemoryDb()
  let app: TestingModule

  beforeAll(async () => {
    await mongod.initialize()
    app = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: typeOrmConfigNoSQL
        }),
        TypeOrmModule.forFeature([ShoppingEntity])
      ],
      controllers: [ShoppingController],
      providers: [ShoppingService]
    }).compile()

    shoppingController = app.get<ShoppingController>(ShoppingController)
  })

  beforeEach(async () => {
    await mongod.cleanup()
  })

  afterAll(async () => {
    await mongod.shutdown()
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
