import { AppController } from '@checkout/app/app.controller'
import { AppService } from '@checkout/app/app.service'
import { configuration } from '@checkout/config/configuration'
import { typeOrmConfigNoSQL } from '@checkout/config/factories/typeorm.config'
import { validationSchema } from '@checkout/config/validation/validation'
import { SessionModule } from '@checkout/session/session.module'
import { ShoppingModule } from '@checkout/shopping/shopping.module'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${process.env.NODE_ENV}.env`,
      expandVariables: true,
      isGlobal: true,
      load: [configuration],
      validationSchema
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfigNoSQL
    }),
    SessionModule,
    ShoppingModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
