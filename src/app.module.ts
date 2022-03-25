import { AppController } from '@checkout/app.controller'
import { AppService } from '@checkout/app.service'
import { configuration } from '@checkout/config/configuration'
import { validationSchema } from '@checkout/config/validation/validation'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from './modules/session/session.module'
import { ShoppingEntity } from './modules/shopping/entity/shopping.entity'
import { ShoppingModule } from './modules/shopping/shopping.module'

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
        // if(configService.get('db.type') === 'mongodb'){
        return {
          type: configService.get('db.type'),
          url: configService.get('db.url'),
          entities: [ShoppingEntity],
          synchronize: true,
          useNewUrlParser: true,
          logging: true
        }
        // }else{

        // }
      }
    }),
    SessionModule,
    ShoppingModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
