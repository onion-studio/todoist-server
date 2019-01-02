import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { createDefaultConnection } from './connection'

async function bootstrap() {
  const conn = await createDefaultConnection()
  const app = await NestFactory.create(AppModule)

  const options = new DocumentBuilder()
    .setTitle('Todoist clone REST API')
    .setVersion('0.1')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document)
  app.enableCors()
  await app.listen(3000)
}
bootstrap()
