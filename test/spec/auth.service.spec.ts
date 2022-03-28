import { AuthService } from '@checkout/auth/auth.service'
import { typeOrmConfigNoSQL } from '@checkout/config/factories/typeorm.config'
import { ShoppingEntity } from '@checkout/shopping/entity/shopping.entity'
import { ShoppingService } from '@checkout/shopping/shopping.service'
import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemoryDb } from '@test/mocks/memory-db'

describe('AuthService', () => {
  let authService: AuthService
  let shoppingService: ShoppingService

  let app: TestingModule
  const mongod = new MemoryDb()

  beforeAll(async () => {
    const auth = new AuthService(null)
    jest.spyOn(auth, 'validate').mockReturnValue(null)

    await mongod.initialize()

    app = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: typeOrmConfigNoSQL
        })
      ],
      providers: [
        {
          provide: ShoppingService,
          useFactory: () => ({
            checkClientSecret: jest.fn().mockResolvedValue(new ShoppingEntity())
          })
        },
        AuthService
      ]
    }).compile()

    authService = app.get<AuthService>(AuthService)
    shoppingService = app.get<ShoppingService>(ShoppingService)
  })

  beforeEach(async () => {
    await mongod.cleanup()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await mongod.shutdown()
  })

  describe('AuthService', () => {
    it('OK', async () => {
      shoppingService.checkClientSecret = jest.fn().mockResolvedValue(new ShoppingEntity())
      const result = await authService.validate('123', '123')
      expect(result).toEqual(new ShoppingEntity())
    })
    it('UnauthorizedException', async () => {
      shoppingService.checkClientSecret = jest.fn().mockRejectedValue(new NotFoundException())
      await expect(authService.validate('123', '1234')).rejects.toThrow()
    })
  })
})
