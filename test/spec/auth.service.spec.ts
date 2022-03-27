import { AuthService } from '@checkout/auth/auth.service'
import { typeOrmConfigNoSQL } from '@checkout/config/factories/typeorm.config'
import { ShoppingModule } from '@checkout/shopping/shopping.module'
import { ShoppingService } from '@checkout/shopping/shopping.service'
import { forwardRef } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemoryDb } from '@test/mocks/memory-db'

jest.mock('@checkout/shopping/shopping.service')

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
        }),
        forwardRef(() => ShoppingModule)
      ],
      providers: [AuthService]
    }).compile()

    authService = app.get<AuthService>(AuthService)
    shoppingService = app.get<ShoppingService>(ShoppingService)

    jest.spyOn(shoppingService, 'checkClientSecret').mockImplementation(async (id: string, clientId: number) => {
      if (clientId === 123 && id === '123') return Promise.resolve({ _id: '123', secretId: '123', callback: '' })
      return Promise.resolve(null)
    })
  })

  beforeEach(async () => {
    await mongod.cleanup()
  })

  afterAll(async () => {
    await mongod.shutdown()
  })

  describe('AuthService', () => {
    it('OK', async () => {
      expect(await authService.validate('123', 123)).toEqual({ _id: '123', secretId: '123', callback: '' })
    })
    it('UnauthorizedException', async () => {
      const t = async (): Promise<void> => {
        await authService.validate('123', 1234)
      }
      await expect(t).rejects.toThrow()
    })
  })
})
