import { configuration } from '@checkout/config/configuration'
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
    const typeOrmConfig = await typeOrmConfigNoSQL(configService)
    expect(typeOrmConfig).toBeDefined()
  })
})
