import { AppController } from '@checkout/app/app.controller'
import { AppService } from '@checkout/app/app.service'
import { configuration } from '@checkout/config/configuration'
import { validationSchema } from '@checkout/config/validation/validation'
import { SessionModule } from '@checkout/session/session.module'
import { ShoppingEntity } from '@checkout/shopping/entity/shopping.entity'
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
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log('url', configService.get('db.url'))
        return {
          type: configService.get('db.type'),
          url: configService.get('db.url'),
          entities: [ShoppingEntity],
          synchronize: true,
          useNewUrlParser: true,
          logging: true
        }
      }
    }),
    SessionModule,
    ShoppingModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
