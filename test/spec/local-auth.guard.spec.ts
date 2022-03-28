import { AuthService } from '@checkout/auth/auth.service'
import { LocalAuthGuard } from '@checkout/auth/local-auth.guard'
import { ShoppingEntity } from '@checkout/shopping/entity/shopping.entity'
import { createMock } from '@golevelup/nestjs-testing'
import { ExecutionContext, NotFoundException } from '@nestjs/common'

describe('LocalAuthGuard', () => {
  let localAuthGuard: LocalAuthGuard
  let mockAuthService: AuthService
  beforeEach(() => {
    mockAuthService = createMock<AuthService>()
    localAuthGuard = new LocalAuthGuard(mockAuthService)
  })

  it('should be defined', () => {
    expect(localAuthGuard).toBeDefined()
  })

  it('should canActivate', async () => {
    mockAuthService.validate = jest.fn().mockResolvedValue(new ShoppingEntity())
    const mockExecutionContext = createMock<ExecutionContext>()
    mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
      headers: {
        clientId: 'dummy',
        clientSecret: 'dummy'
      }
    })
    const result = await localAuthGuard.canActivate(mockExecutionContext)
    expect(result).toBeTruthy()
  })

  it('should not canActivate', async () => {
    mockAuthService.validate = jest.fn().mockRejectedValue(new NotFoundException())
    const mockExecutionContext = createMock<ExecutionContext>()
    mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
      headers: {
        clientId: 'dummy',
        clientSecret: 'dummy'
      }
    })
    const t = async (): Promise<void> => {
      await localAuthGuard.canActivate(mockExecutionContext)
    }
    await expect(t).rejects.toThrow()
  })
})
