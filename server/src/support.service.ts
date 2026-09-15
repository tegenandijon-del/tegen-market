import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  // Yangi qo'llab-quvvatlash xabarini/murojaatini yaratish
  async createTicket(userId: number, data: { subject?: string; message: string }) {
    return this.prisma.message.create({
      data: {
        userId,
        text: data.message,
        // Agarda Prisma schemada qo'shimcha maydonlar bo'lsa
      },
    });
  }

  // Foydalanuvchining barcha murojaatlarini olish
  async getUserTickets(userId: number) {
    return this.prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin uchun barcha murojaatlarni olish
  async getAllTickets() {
    return this.prisma.message.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Murojaatni ID bo'yicha olish
  async getTicketById(id: number) {
    const ticket = await this.prisma.message.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!ticket) {
      throw new NotFoundException('Murojaat topilmadi');
    }

    return ticket;
  }

  // Murojaatni o'chirish
  async deleteTicket(id: number) {
    await this.getTicketById(id);
    return this.prisma.message.delete({
      where: { id },
    });
  }
}
