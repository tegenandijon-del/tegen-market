import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getStats(startDate?: string, endDate?: string) {
    return {
      message: 'Statistika',
      startDate,
      endDate,
    };
  }

  async getTopProducts(limit: number = 10) {
    return this.prisma.product.findMany({
      take: Number(limit),
    });
  }
}
