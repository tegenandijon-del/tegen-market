import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Config servisini olish
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // CORS sozlamalari (Telegram Mini App va boshqa frontend so'rovlari uchun)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global DTO validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API uchun umumiy prefiqs
  app.setGlobalPrefix('api');

  await app.listen(port);
  console.log(`Server listening on port: ${port}`);
}

bootstrap();
