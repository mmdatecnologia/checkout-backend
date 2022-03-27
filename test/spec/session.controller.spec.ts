import { AuthModule } from '@checkout/auth/auth.module'
import { AuthService } from '@checkout/auth/auth.service'
import { CacheRedisModule } from '@checkout/cache/cache.redis.module'
import { configuration } from '@checkout/config/configuration'
import { typeOrmConfigNoSQL } from '@checkout/config/factories/typeorm.config'
import { validationSchema } from '@checkout/config/validation/validation'
import { SessionDto } from '@checkout/session/DTO/session.dto'
import { SizeDto } from '@checkout/session/DTO/size.dto'
import { SessionController } from '@checkout/session/session.controller'
import { SessionService } from '@checkout/session/session.service'
import { ShoppingModule } from '@checkout/shopping/shopping.module'
import { forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemoryDb } from '@test/mocks/memory-db'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import * as faker from 'faker-br'

jest.mock('@checkout/auth/auth.service')

describe('SessionController', () => {
  let sessionController: SessionController
  let sessionValue: SessionDto

  let app: TestingModule
  const mongod = new MemoryDb()

  beforeAll(async () => {
    const auth = new AuthService(null)
    jest.spyOn(auth, 'validate').mockReturnValue(null)
    await mongod.initialize()
    app = await Test.createTestingModule({
      controllers: [SessionController],
      imports: [
        ConfigModule.forRoot({
          envFilePath: `${process.cwd()}/src/config/env/${process.env.NODE_ENV}.env`,
          expandVariables: true,
          isGlobal: true,
          load: [configuration],
          validationSchema
        }),
        TypeOrmModule.forRootAsync({
          useFactory: typeOrmConfigNoSQL
        }),
        forwardRef(() => CacheRedisModule),
        forwardRef(() => AuthModule),
        forwardRef(() => ShoppingModule)
      ],
      providers: [SessionService]
    }).compile()

    sessionController = app.get<SessionController>(SessionController)
    const sessionData = {
      store: faker.random.number(),
      items: [
        {
          id: faker.random.number(),
          title: faker.commerce.productName(),
          price: parseFloat(faker.commerce.price()),
          quantity: faker.random.number(),
          description: faker.commerce.productAdjective(),
          size: {
            height: faker.random.number(),
            length: faker.random.number(),
            width: faker.random.number()
          }
        }
      ]
    }
    sessionValue = plainToClass(SessionDto, sessionData)
  })

  beforeEach(async () => {
    await mongod.cleanup()
  })

  afterAll(async () => {
    await mongod.shutdown()
  })

  describe('createSession', () => {
    it('should create session', async () => {
      const key = await sessionController.set(sessionValue, {
        id: faker.random.number(),
        clientId: faker.random.number()
      })
      const resp = await sessionController.get(key)
      expect(sessionValue).toEqual(resp)
    })
  })

  describe('SessionValues', () => {
    it('should accept', async () => {
      const status = await validate(sessionValue)
      const size = sessionValue.items[0].size
      expect(size).toBeInstanceOf(SizeDto)
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
