import { AuthModule } from '@checkout/auth/auth.module'
import { CacheRedisModule } from '@checkout/cache/cache.redis.module'
import { configuration } from '@checkout/config/configuration'
import { typeOrmConfigNoSQL } from '@checkout/config/factories/typeorm.config'
import { validationSchema } from '@checkout/config/validation/validation'
import { SessionController } from '@checkout/session/session.controller'
import { SessionModule } from '@checkout/session/session.module'
import { SessionService } from '@checkout/session/session.service'
import { ShoppingController } from '@checkout/shopping/shopping.controller'
import { ShoppingModule } from '@checkout/shopping/shopping.module'
import { forwardRef, INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemoryDb } from '@test/mocks/memory-db'
import { SessionFactoryDto } from '@test/mocks/session-factory-dto'
import { ShoppingFactoryDto } from '@test/mocks/shopping-factory-dto'
import * as request from 'supertest'

describe('SessionController (e2e)', () => {
  let app: INestApplication
  const sessionFactoryDto = new SessionFactoryDto()
  const shoppingFactoryDto = new ShoppingFactoryDto()
  const mongod = new MemoryDb()
  let shoppingController: ShoppingController
  let sessionController: SessionController

  beforeAll(async () => {
    await mongod.initialize()
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
        forwardRef(() => ShoppingModule).forwardRef(() => SessionModule)
      ],
      providers: [SessionService],
      controllers: [SessionController, ShoppingController]
    }).compile()
    shoppingController = moduleFixture.get<ShoppingController>(ShoppingController)
    sessionController = moduleFixture.get<SessionController>(SessionController)

    app = moduleFixture.createNestApplication()
    await app.init()
    app.enableShutdownHooks()
    await app.init()
  })

  beforeEach(async () => {
    await mongod.cleanup()
  })

  afterAll(async () => {
    await app.close()
    await mongod.shutdown()
  })
  describe('/ (GET)', () => {
    it('should authorized', async () => {
      const shoppingDto = shoppingFactoryDto.shoppingDto()
      const createdShopping = await shoppingController.createShopping(shoppingDto)
      const item = sessionFactoryDto.createItemDto('food')
      const shipping = sessionFactoryDto.createShippingDto()
      const sessionValue = sessionFactoryDto.createSessionDto(shipping, [item])
      const sessionHeaders = {
        clientid: createdShopping.clientId,
        clientsecret: createdShopping.clientSecret
      }
      const session = await sessionController.set(sessionValue, sessionHeaders)
      return request(app.getHttpServer())
        .get('/session')
        .query({ key: session })
        .set('clientId', createdShopping.clientId)
        .set('clientSecret', createdShopping.clientSecret)
        .expect(200)
    })
    it('should not authorized', async () => {
      const shoppingDto = shoppingFactoryDto.shoppingDto()
      const createdShopping = await shoppingController.createShopping(shoppingDto)
      const item = sessionFactoryDto.createItemDto('food')
      const shipping = sessionFactoryDto.createShippingDto()
      const sessionValue = sessionFactoryDto.createSessionDto(shipping, [item])
      const sessionHeaders = {
        clientid: createdShopping.clientId,
        clientsecret: createdShopping.clientSecret
      }
      const session = await sessionController.set(sessionValue, sessionHeaders)
      return request(app.getHttpServer())
        .get('/session')
        .query({ key: session })
        .set('clientId', 'wrongClientId')
        .set('clientSecret', 'wrongClientSecret')
        .expect(401)
    })
  })
  describe('/ (POST)', () => {
    it('should authorized', async () => {
      const shoppingDto = shoppingFactoryDto.shoppingDto()
      const createdShopping = await shoppingController.createShopping(shoppingDto)
      const item = sessionFactoryDto.createItemDto('food')
      const shipping = sessionFactoryDto.createShippingDto()
      const sessionValue = sessionFactoryDto.createSessionDto(shipping, [item])
      return request(app.getHttpServer())
        .post('/session')
        .send(sessionValue)
        .set('clientId', createdShopping.clientId)
        .set('clientSecret', createdShopping.clientSecret)
        .expect(201)
    })
    it('should not authorized', async () => {
      const shoppingDto = shoppingFactoryDto.shoppingDto()
      await shoppingController.createShopping(shoppingDto)
      const item = sessionFactoryDto.createItemDto('food')
      const shipping = sessionFactoryDto.createShippingDto()
      const sessionValue = sessionFactoryDto.createSessionDto(shipping, [item])
      return request(app.getHttpServer())
        .post('/session')
        .send(sessionValue)
        .set('clientId', 'otherClientId')
        .set('clientSecret', 'otherClientId')
        .expect(401)
    })
  })
})
