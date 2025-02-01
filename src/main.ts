import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exception-filter/global-exception.filter';
import { AccessGuard } from './guards/access.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Planora'
    }),
  });
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.useGlobalFilters(new GlobalExceptionFilter(new Logger));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AccessGuard(new Reflector));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
