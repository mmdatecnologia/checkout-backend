import { configuration } from '@checkout/config/configuration'
import { redisConfig } from '@checkout/config/factories/redis.config'
import { typeOrmConfigNoSQL } from '@checkout/config/factories/typeorm.config'
import { validationSchema } from '@checkout/config/validation/validation'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

describe('TypeormConfig', () => {
  let app: TestingModule
  let configService: ConfigService
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `${process.cwd()}/src/config/env/${process.env.NODE_ENV}.env`,
          expandVariables: true,
          isGlobal: true,
          load: [configuration],
          validationSchema
        })
      ]
    }).compile()

    configService = app.get<ConfigService>(ConfigService)
  })
  it('should be a valid typeorm config', async () => {
    const config = await typeOrmConfigNoSQL(configService)
    expect(config).toBeDefined()
  })
  it('should be a valid redis config', async () => {
    jest.spyOn(configService, 'get').mockImplementation(() => 'redis')
    const config = await redisConfig(configService)
    expect(config).toBeDefined()
  })
  it('should be a not use redis', async () => {
    const config = await redisConfig(configService)
    expect(config).toBeDefined()
  })
})
