import { AppModule } from '@checkout/app.module'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  await app.listen(configService.get<number>('PORT') ?? 3000)
}
bootstrap()
  .then(() => true)
  .catch((err) => console.error(err))
