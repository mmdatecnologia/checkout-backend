import { AuthModule } from '@checkout/auth/auth.module'
import { CacheRedisModule } from '@checkout/cache/cache.redis.module'
import { configuration } from '@checkout/config/configuration'
import { typeOrmConfigNoSQL } from '@checkout/config/factories/typeorm.config'
import { validationSchema } from '@checkout/config/validation/validation'
import { SizeDto } from '@checkout/session/DTO/size.dto'
import { SessionController } from '@checkout/session/session.controller'
import { SessionService } from '@checkout/session/session.service'
import { ShoppingModule } from '@checkout/shopping/shopping.module'
import { forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemoryDb } from '@test/mocks/memory-db'
import { SessionFactoryDto } from '@test/mocks/session-factory-dto'
import { ShoppingFactoryDto } from '@test/mocks/shopping-factory-dto'
import { validate } from 'class-validator'

jest.mock('@checkout/auth/auth.service')

describe('SessionController', () => {
  let sessionController: SessionController
  let app: TestingModule
  const mongod = new MemoryDb()
  const sessionFactoryDto = new SessionFactoryDto()
  const shoppingFactoryDto = new ShoppingFactoryDto()
  beforeAll(async () => {
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
  })

  beforeEach(async () => {
    await mongod.cleanup()
  })

  afterAll(async () => {
    await mongod.shutdown()
  })

  describe('createSession', () => {
    it('should create session', async () => {
      const shopping = shoppingFactoryDto.shoppingDto()
      const shipping = sessionFactoryDto.createShippingDto()
      const item = sessionFactoryDto.createItemDto('food')
      const session = sessionFactoryDto.createSessionDto(shipping, [item])
      const { clientId, clientSecret } = shopping
      const key = await sessionController.set(session, { clientid: clientId, clientsecret: clientSecret })
      const resp = await sessionController.get(key, { clientid: clientId, clientsecret: clientSecret })
      expect({ ...session, client: { clientId, clientSecret } }).toEqual(resp)
    })
    it('UnauthorizedException', async () => {
      const t = async (): Promise<void> => {
        const shopping = shoppingFactoryDto.shoppingDto()
        const shipping = sessionFactoryDto.createShippingDto()
        const item = sessionFactoryDto.createItemDto('food')
        const session = sessionFactoryDto.createSessionDto(shipping, [item])
        const { clientId, clientSecret } = shopping
        const key = await sessionController.set(session, { clientid: clientId, clientsecret: clientSecret })
        await sessionController.get(key, { clientid: 'other', clientsecret: 'other' })
      }
      await expect(t).rejects.toThrow()
    })
  })

  describe('SessionValues', () => {
    it('should accept', async () => {
      const shipping = sessionFactoryDto.createShippingDto()
      const item = sessionFactoryDto.createItemDto('food')
      const session = sessionFactoryDto.createSessionDto(shipping, [item])
      const status = await validate(session)
      const size = session.items[0].size
      expect(size).toBeInstanceOf(SizeDto)
      expect(status.length).toBe(0)
    })

    it('should refuse by store', async () => {
      const shipping = sessionFactoryDto.createShippingDto()
      const item = sessionFactoryDto.createItemDto('food')
      const session = sessionFactoryDto.createSessionDto(shipping, [item])
      session.shipping.zipCode = undefined
      const status = await validate(session)
      expect(status.length).toBe(1)
      expect(status[0].children[0].constraints.isNotEmpty).toBeTruthy()
    })
  })
})
