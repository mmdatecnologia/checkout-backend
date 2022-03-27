import { AuthService } from '@checkout/auth/auth.service'
import { ShoppingEntity } from '@checkout/shopping/entity/shopping.entity'
import { ShoppingModule } from '@checkout/shopping/shopping.module'
import { ShoppingService } from '@checkout/shopping/shopping.service'
import { forwardRef } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongoMemoryServer } from 'mongodb-memory-server'

jest.mock('@checkout/shopping/shopping.service')

describe('AuthService', () => {
  let authService: AuthService
  let shoppingService: ShoppingService

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
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create()
            return {
              name: 'default',
              type: 'mongodb',
              url: mongod.getUri(),
              entities: [ShoppingEntity],
              synchronize: true,
              useNewUrlParser: true,
              logging: true
            }
          }
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
  describe('AuthService', () => {
    it('OK', async () => {
      expect(await authService.validate('123', 123)).toBeUndefined()
    })
    it('UnauthorizedException', async () => {
      const t = async (): Promise<void> => {
        await authService.validate('123', 1234)
      }
      await expect(t).rejects.toThrow()
    })
  })
})
