import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }

  // Modul ishga tushganda ma'lumotlar bazasiga ulanish
  async onModuleInit() {
    await this.$connect();
  }

  // Modul to'xtatilganda ulanishni xavfsiz uzish
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
