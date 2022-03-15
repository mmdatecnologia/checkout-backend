import { AppController } from '@checkout/app.controller'
import { AppService } from '@checkout/app.service'
import { configuration } from '@checkout/config/configuration'
import { validationSchema } from '@checkout/config/validation/validation'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SessionModule } from './modules/session/session.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${process.env.NODE_ENV}.env`,
      expandVariables: true,
      isGlobal: true,
      load: [configuration],
      validationSchema
    }),
    SessionModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
