import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { createConnection } from 'typeorm'
import { AppModule } from './app.module'

async function bootstrap() {
  const conn = await createConnection()
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
