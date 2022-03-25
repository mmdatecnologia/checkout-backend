import { ShoppingEntity } from '@checkout/modules/shopping/entity/shopping.entity'
import { ShoppingController } from '@checkout/modules/shopping/shopping.controller'
import { ShoppingService } from '@checkout/modules/shopping/shopping.service'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongoMemoryServer } from 'mongodb-memory-server'

// TODO remove this unnecessary file
describe('ShoppingService', () => {
  let shoppingService: ShoppingService
  let mongod: MongoMemoryServer
  let app: TestingModule

  afterAll(async () => {
    await app.close()
    if (mongod) await mongod.stop()
  })

  beforeEach(async () => {
    // const mongoMemoryServer = new MongoMemoryServer()
    app = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create()
            return {
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

    shoppingService = app.get<ShoppingService>(ShoppingService)
  })

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const shopping = await shoppingService.create({
        secretId: '123',
        callback: 'http://teste.com.br/callback',
        _id: '123'
      })

      const consutla = await shoppingService.get(shopping._id)

      expect(shopping._id).toEqual(consutla._id)
      expect(shopping.callback).toEqual(consutla.callback)
      expect(shopping.secretId).toEqual(consutla.secretId)
    })
  })
})
