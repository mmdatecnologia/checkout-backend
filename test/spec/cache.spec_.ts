import { CacheRedisService } from '@checkout/modules/cache/cache.redis.service'
import { CacheModule } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { v4 as uuidv4 } from 'uuid'

describe('CacheSerivce', () => {
  let cacheRedisService: CacheRedisService
  const key = uuidv4()

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [CacheRedisService]
    }).compile()

    cacheRedisService = app.get<CacheRedisService>(CacheRedisService)
  })

  describe('root', () => {
    it('should create session', async () => {
      const value = 'teste'
      await cacheRedisService.set<string>(key, value)
      const ret = await cacheRedisService.get<string>(key)
      expect(ret).toEqual(value)
    })

    it('should remove session', async () => {
      await cacheRedisService.delete(key)
      const ret = await cacheRedisService.get<string>(key)
      expect(ret).toBe(undefined)
    })
  })
})
