import { typeOrmConfigNoSQL } from '@checkout/config/factories/typeorm.config'
import { ShoppingEntity } from '@checkout/shopping/entity/shopping.entity'
import { ShoppingController } from '@checkout/shopping/shopping.controller'
import { ShoppingService } from '@checkout/shopping/shopping.service'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemoryDb } from '@test/mocks/memory-db'
import { ShoppingFactoryDto } from '@test/mocks/shopping-factory-dto'
import { instanceToPlain } from 'class-transformer'

describe('ShoppingController', () => {
  let shoppingController: ShoppingController
  const mongod = new MemoryDb()
  const shoppingFactoryDto = new ShoppingFactoryDto()
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
      const shoppingDto = shoppingFactoryDto.shoppingDto()
      const createdShopping = await shoppingController.createShopping(shoppingDto)
      const plainCreatedShopping = instanceToPlain(createdShopping)
      expect(createdShopping.id.toString()).toEqual(plainCreatedShopping.id)
      expect(createdShopping.clientId).toEqual(shoppingDto.clientId)
      expect(createdShopping.clientSecret).toEqual(shoppingDto.clientSecret)
      expect(createdShopping.baseUrl).toEqual(shoppingDto.baseUrl)
      expect(createdShopping.checkoutCallback).toEqual(shoppingDto.checkoutCallback)
      expect(createdShopping.createdAt).toBeDefined()
      expect(createdShopping.updatedAt).toBeDefined()
    })
  })
})
