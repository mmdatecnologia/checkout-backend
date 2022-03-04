import { AppController } from '@checkout/app.controller'
import { AppService } from '@checkout/app.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
