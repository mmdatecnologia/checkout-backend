import { AuthService } from '@checkout/auth/auth.service'
import { typeOrmConfigNoSQL } from '@checkout/config/factories/typeorm.config'
import { ShoppingDto } from '@checkout/shopping/DTO/shopping.dto'
import { ShoppingModule } from '@checkout/shopping/shopping.module'
import { ShoppingService } from '@checkout/shopping/shopping.service'
import { forwardRef } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemoryDb } from '@test/mocks/memory-db'
import { plainToClass } from 'class-transformer'

jest.mock('@checkout/shopping/shopping.service')

describe('AuthService', () => {
  let authService: AuthService
  let shoppingService: ShoppingService
  let shoppingDto: ShoppingDto

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

    shoppingDto = plainToClass(ShoppingDto, {
      clientId: '123',
      clientSecret: '123',
      baseUrl: 'http://teste.com.br',
      checkoutCallback: 'http://teste.com.br/callback'
    })
    shoppingService = app.get<ShoppingService>(ShoppingService)
    jest
      .spyOn(shoppingService, 'checkClientSecret')
      .mockImplementation(async (clientId: string, clientSecret: string) => {
        if (clientId === '123' && clientSecret === '123') return Promise.resolve(shoppingDto)
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
      expect(await authService.validate('123', '123')).toEqual(shoppingDto)
    })
    it('UnauthorizedException', async () => {
      const t = async (): Promise<void> => {
        await authService.validate('123', '1234')
      }
      await expect(t).rejects.toThrow()
    })
  })
})
