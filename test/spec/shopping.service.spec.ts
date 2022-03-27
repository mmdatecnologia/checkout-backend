import { typeOrmConfigNoSQL } from '@checkout/config/factories/typeorm.config'
import { ShoppingDtoResponse } from '@checkout/shopping/DTO/shopping.dto'
import { ShoppingEntity } from '@checkout/shopping/entity/shopping.entity'
import { ShoppingController } from '@checkout/shopping/shopping.controller'
import { ShoppingService } from '@checkout/shopping/shopping.service'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemoryDb } from '@test/mocks/memory-db'

describe('ShoppingService', () => {
  let shoppingService: ShoppingService
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

    shoppingService = app.get<ShoppingService>(ShoppingService)
  })

  beforeEach(async () => {
    await mongod.cleanup()
  })

  afterAll(async () => {
    await mongod.shutdown()
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
    it('Should return null if shopping not found', async () => {
      const shoppingDtoResponse = Object.assign(new ShoppingDtoResponse(), {
        clientId: 1234,
        baseUrl: 'http://teste.com.br/callback'
      })

      const shopping = await shoppingService.checkClientSecret(
        shoppingDtoResponse.secretId,
        shoppingDtoResponse.clientId
      )

      expect(shopping).toBeFalsy()
    })
  })
})
