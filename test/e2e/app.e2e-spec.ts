import { AppController } from '@checkout/app/app.controller'
import { AppService } from '@checkout/app/app.service'
import { typeOrmConfigNoSQL } from '@checkout/config/factories/typeorm.config'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemoryDb } from '@test/mocks/memory-db'
import * as request from 'supertest'

describe('AppController (e2e)', () => {
  let app: INestApplication
  const memoryDb = new MemoryDb()
  beforeAll(async () => {
    await memoryDb.initialize()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: typeOrmConfigNoSQL
        })
      ],
      controllers: [AppController],
      providers: [AppService]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    app.enableShutdownHooks()
    await app.init()
  })

  beforeEach(async () => {
    await memoryDb.cleanup()
  })

  afterAll(async () => {
    await app.close()
    await memoryDb.shutdown()
  })

  it('/ (GET)', async () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!')
  })
})
