import { CacheRedisModule } from '@checkout/modules/cache/cache.redis.module'
import { ItemDto } from '@checkout/modules/session/DTO/item.dto'
import { SessionDto } from '@checkout/modules/session/DTO/session.dto'
import { ShippingDto } from '@checkout/modules/session/DTO/shipping.dto'
import { SizeDto } from '@checkout/modules/session/DTO/size.dto'
import { SessionController } from '@checkout/modules/session/session.controller'
import { SessionService } from '@checkout/modules/session/session.service'
import { forwardRef } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { validate } from 'class-validator'
import * as faker from 'faker-br'
import { v4 as uuidv4 } from 'uuid'

describe('AppController', () => {
  let sessionController: SessionController
  let sessionValue: SessionDto

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      imports: [forwardRef(() => CacheRedisModule)],
      providers: [SessionService]
    }).compile()

    sessionController = app.get<SessionController>(SessionController)

    sessionValue = new SessionDto()
    sessionValue.store = uuidv4()

    const item = new ItemDto()
    item.id = uuidv4()
    item.title = faker.commerce.productName()
    item.price = faker.commerce.price()
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
      const key = await sessionController.set(sessionValue)
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
      newSession.store = faker.company.companyName()
      const status = await validate(sessionValue)
      expect(status.length).toBe(1)
      expect(status[0].constraints.isUuid.length > 0).toBe(true)
    })

    it('should refuse by shipping', async () => {
      const newSession = sessionValue
      newSession.shipping = new ShippingDto()
      newSession.shipping.distance = -1
      const status = await validate(sessionValue)
      expect(status.length).toBe(1)
      expect(status[0].children[0].constraints.min.length > 0).toBe(true)
      expect(status[0].children[0].constraints.isPositive.length > 0).toBe(true)
    })
  })
})
