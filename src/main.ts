import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './exception-filter/global-exception.filter';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: new ConsoleLogger({
            prefix: 'Planora',
            logLevels: process.env.DEBUG ? undefined : ['log', 'warn', 'error'],
        }),
    });
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle('Planora API')
        .setVersion('In-dev 0.0.1')
        .build();
    const documentFactory = (): OpenAPIObject =>
        SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
