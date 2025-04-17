import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// adding swagger configuration and global pipes to use HttpExceptionFilter()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const port = process.env.PORT ?? 300;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
  .setTitle('Price Analysis demo for livecoding.')
  .setDescription('API for fetching and alysing data from BinanceAPI')
  .setVersion('1.0')
  .addTag('Price Analysis')
  .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  logger.log(`Swagger UI avaliable at http://localhost:${port}/api`)

  await app.listen(port);
  logger.log(`Server is running on port ${port}`)
}
bootstrap();
