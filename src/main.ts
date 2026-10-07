import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // Habilitar CORS para integración con clientes frontend
  app.enableCors();

  // Prefijo global y versionamiento de endpoints (/api/v1/...)
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validación y transformación global de DTOs con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración de documentación OpenAPI / Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cachalot CRM - Contacts & Notes API')
    .setDescription(
      'API REST desarrollada con NestJS, TypeScript y PostgreSQL para la gestión de contactos y notas de clientes.',
    )
    .setVersion('1.0')
    .addTag('contacts', 'Operaciones con contactos')
    .addTag('notes', 'Operaciones con notas de contactos')
    .addTag('health', 'Verificación de estado y salud del sistema')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Cachalot CRM API Docs',
  });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
