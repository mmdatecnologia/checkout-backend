import { AppController } from '@checkout/app.controller'
import { AppService } from '@checkout/app.service'
import { configuration } from '@checkout/config/configuration'
import { validationSchema } from '@checkout/config/validation/validation'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientModule } from './modules/client/client.module'
import { Client } from './modules/client/entity/client.entity'
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
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://root:example@localhost:27017/admin',
      entities: [Client],
      synchronize: true,
      useNewUrlParser: true,
      logging: true
    }),
    SessionModule,
    ClientModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
