import { AuthService } from '@checkout/modules/auth/auth.service'
import { ShoppingEntity } from '@checkout/modules/shopping/entity/shopping.entity'
import { ShoppingModule } from '@checkout/modules/shopping/shopping.module'
import { ShoppingService } from '@checkout/modules/shopping/shopping.service'
import { forwardRef } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongoMemoryServer } from 'mongodb-memory-server'
jest.mock('@checkout/modules/shopping/shopping.service')

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
              url: await mongod.getUri(),
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

    jest.spyOn(shoppingService, 'checkClientSecret').mockImplementation(async (id: string, secretId: string) => {
      if (id === secretId) return Promise.resolve({ _id: '123', secretId: '123', callback: '' })
      return Promise.resolve(null)
    })
  })
  describe('AuthService', () => {
    it('OK', async () => {
      expect(await authService.validate('123', '123')).toBeUndefined()
    })
    it('UnauthorizedException', async () => {
      const t = async (): Promise<void> => {
        await authService.validate('123', '1234')
      }
      await expect(t).rejects.toThrow()
    })
  })

  // describe('SessionValues', () => {
  //   it('should accept', async () => {
  //     const status = await validate(sessionValue)
  //     expect(status.length).toBe(0)
  //   })

  //   it('should refuse by store', async () => {
  //     const newSession = sessionValue
  //     newSession.store = null
  //     const status = await validate(sessionValue)
  //     expect(status.length).toBe(1)
  //     expect(status[0].constraints.isNotEmpty).toBeTruthy()
  //   })
  // })
})
