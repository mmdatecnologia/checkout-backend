import { AppController } from '@checkout/app/app.controller'
import { AppService } from '@checkout/app/app.service'
import { Test, TestingModule } from '@nestjs/testing'

// TODO remove this unnecessary file
describe('AppController', () => {
  let appController: AppController

  let app: TestingModule

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!')
    })
  })
})
