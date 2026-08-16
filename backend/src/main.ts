import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { SWAGGER_PATH, setupSwagger } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);

  const secureHeaders = helmet();

  app.use((request: Request, response: Response, next: NextFunction) => {
    if (request.path.startsWith(`/${SWAGGER_PATH}`)) {
      return next();
    }

    return secureHeaders(request, response, next);
  });

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: config.get<string[]>('corsOrigins'),
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableShutdownHooks();

  setupSwagger(app);

  const port = config.get<number>('port') ?? 4000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`NoboNG API listening on http://localhost:${port}/api`);
  logger.log(`API reference available at http://localhost:${port}/${SWAGGER_PATH}`);
}

void bootstrap();
