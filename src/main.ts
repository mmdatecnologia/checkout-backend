import { AppModule } from '@checkout/app/app.module'
import { ClassSerializerInterceptor, HttpStatus, VersioningType } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      validationError: { target: true, value: true },
      whitelist: true,
      forbidUnknownValues: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  )

  app.enableVersioning({
    type: VersioningType.URI
  })

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  const configService = app.get(ConfigService)
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name'))
    .setDescription(configService.get<string>('app.description'))
    .setVersion(configService.get<string>('app.version'))
    .build()
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => `${controllerKey}:${methodKey}`
  }
  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup('api', app, document)

  await app.listen(configService.get<number>('app.port') ?? 3000)
}
bootstrap()
  .then(() => true)
  .catch((err) => console.error(err))
