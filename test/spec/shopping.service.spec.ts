import { typeOrmConfigNoSQL } from '@checkout/config/factories/typeorm.config'
import { ShoppingEntity } from '@checkout/shopping/entity/shopping.entity'
import { ShoppingController } from '@checkout/shopping/shopping.controller'
import { ShoppingService } from '@checkout/shopping/shopping.service'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemoryDb } from '@test/mocks/memory-db'
import { ShoppingFactoryDto } from '@test/mocks/shopping-factory-dto'

describe('ShoppingService', () => {
  let shoppingService: ShoppingService
  const mongod = new MemoryDb()
  let app: TestingModule
  const shoppingFactoryDto = new ShoppingFactoryDto()

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
      const shoppingDto = shoppingFactoryDto.shoppingDto()
      const createdShopping = await shoppingService.create(shoppingDto)
      const shopping = await shoppingService.get(createdShopping.clientId, createdShopping.clientSecret)

      expect(createdShopping.clientId).toEqual(shopping.clientId)
      expect(createdShopping.clientSecret).toEqual(shopping.clientSecret)
      expect(createdShopping.baseUrl).toEqual(shopping.baseUrl)
    })

    it('CheckSecret"', async () => {
      const shoppingDto = shoppingFactoryDto.shoppingDto()
      const createdShopping = await shoppingService.create(shoppingDto)
      const shopping = await shoppingService.checkClientSecret(createdShopping.clientId, createdShopping.clientSecret)

      expect(createdShopping.clientId).toEqual(shopping.clientId)
      expect(createdShopping.clientSecret).toEqual(shopping.clientSecret)
      expect(createdShopping.baseUrl).toEqual(shopping.baseUrl)
    })
    it('UnauthorizedException', async () => {
      const t = async (): Promise<void> => {
        const shoppingDto = shoppingFactoryDto.shoppingDto()
        await shoppingService.checkClientSecret(shoppingDto.clientId, shoppingDto.clientSecret)
      }
      await expect(t).rejects.toThrow()
    })
  })
})
