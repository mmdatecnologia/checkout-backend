import { AuthModule } from '@checkout/modules/auth/auth.module'
import { AuthService } from '@checkout/modules/auth/auth.service'
import { CacheRedisModule } from '@checkout/modules/cache/cache.redis.module'
import { ItemDto } from '@checkout/modules/session/DTO/item.dto'
import { SessionDto } from '@checkout/modules/session/DTO/session.dto'
import { SizeDto } from '@checkout/modules/session/DTO/size.dto'
import { SessionController } from '@checkout/modules/session/session.controller'
import { SessionService } from '@checkout/modules/session/session.service'
import { ShoppingEntity } from '@checkout/modules/shopping/entity/shopping.entity'
import { ShoppingModule } from '@checkout/modules/shopping/shopping.module'
import { forwardRef } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { validate } from 'class-validator'
import * as faker from 'faker-br'
import { MongoMemoryServer } from 'mongodb-memory-server'
jest.mock('@checkout/modules/auth/auth.service')

describe('SessionController', () => {
  let sessionController: SessionController
  let sessionValue: SessionDto

  let app: TestingModule
  let mongod: MongoMemoryServer

  afterAll(async () => {
    if (mongod) await mongod.stop()
    await app.close()
  })

  beforeAll(async () => {
    const auth = new AuthService(null)
    jest.spyOn(auth, 'validate').mockReturnValue(null)
    app = await Test.createTestingModule({
      controllers: [SessionController],
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
        forwardRef(() => CacheRedisModule),
        forwardRef(() => AuthModule),
        forwardRef(() => ShoppingModule)
      ],
      providers: [SessionService]
    }).compile()

    sessionController = app.get<SessionController>(SessionController)

    // TODO create by mockDtoFactory
    sessionValue = new SessionDto()
    sessionValue.store = 123

    const item = new ItemDto()
    item.id = 123
    item.title = faker.commerce.productName()
    item.price = 123.2
    item.quantity = 1
    item.description = faker.commerce.productAdjective()

    item.size = new SizeDto()
    item.size.height = 1
    item.size.length = 1
    item.size.width = 1

    sessionValue.items = []
    sessionValue.items.push(item)
  })

  describe('createSession', () => {
    it('should create session', async () => {
      const key = await sessionController.set(sessionValue, { clientid: '123', secretid: '123' })
      const resp = await sessionController.get(key)
      expect(sessionValue).toEqual(resp)
    })
  })

  describe('SessionValues', () => {
    it('should accept', async () => {
      const status = await validate(sessionValue)
      expect(status.length).toBe(0)
    })

    it('should refuse by store', async () => {
      const newSession = sessionValue
      newSession.store = null
      const status = await validate(sessionValue)
      expect(status.length).toBe(1)
      expect(status[0].constraints.isNotEmpty).toBeTruthy()
    })
  })
})
