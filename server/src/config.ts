import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  botToken: process.env.BOT_TOKEN,
  adminSecret: process.env.ADMIN_SECRET || 'admin_secret_key',
  botSecret: process.env.BOT_SECRET || 'bot_secret_key',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
}));
