import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const typeOrmConfigNoSQL = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
  return {
    type: configService.get<'mongodb'>('db.type'),
    url: configService.get<string>('db.url'),
    entities: [__dirname + '../**/*.entity.ts'],
    synchronize: true,
    autoLoadEntities: true,
    useUnifiedTopology: true,
    keepConnectionAlive: true,
    retryWrites: false,
    ssl: configService.get<boolean>('db.ssl')
  }
}
