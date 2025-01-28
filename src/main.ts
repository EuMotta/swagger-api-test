import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './utils/db-response-error';
import { ResponseInterceptor } from './utils/db-response-success';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableCors({
    origin: 'http://localhost:3001',
  });
  await app.listen(3001);
}

bootstrap();
