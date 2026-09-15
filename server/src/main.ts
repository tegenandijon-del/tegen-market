import { NestFactory } from '@nestjs/core';
import { AppModule } from './module'; // Import yo'li './module' ga o'zgartirildi

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
