import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async getLogs() {
    return this.prisma.auditLog.findMany({
      select: {
        id: true, // 'Number' o'rniga 'true' qo'yildi
        action: true,
        details: true,
        createdAt: true,
      },
    });
  }
}
