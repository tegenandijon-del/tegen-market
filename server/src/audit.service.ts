import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async getLogs(page?: number, limit?: number, userId?: number) {
    const take = limit || 10;
    const skip = page ? (page - 1) * take : 0;
    
    return this.prisma.auditLog.findMany({
      where: userId ? { userId: Number(userId) } : {},
      take,
      skip,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLogById(id: number | string) {
    return this.prisma.auditLog.findUnique({
      where: { id: Number(id) },
    });
  }

  async logAction(action: string, details?: string, userId?: number) {
    return this.prisma.auditLog.create({
      data: {
        action,
        details,
        userId: userId ? Number(userId) : undefined,
      },
    });
  }
}
