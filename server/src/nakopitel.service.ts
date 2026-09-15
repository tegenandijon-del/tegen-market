import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class NakopitelService {
  constructor(private prisma: PrismaService) {}

  // Foydalanuvchining balansini va umumiy jamg'argan ballarini olish
  async getUserBalance(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        points: true,
        totalCashback: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return user;
  }

  // Foydalanuvchining ballar va keshbeklar harakati tarixi
  async getUserHistory(userId: number) {
    return this.prisma.cashbackTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin tomonidan qo'lda ball qo'shish yoki ayirish
  async adjustBalance(userId: number, amount: number, reason?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const newPoints = user.points + amount;

    if (newPoints < 0) {
      throw new BadRequestException('Foydalanuvchi balansi manfiy bo\'lib ketishi mumkin emas');
    }

    // Balansni yangilash va tranzaksiya tarixiga yozish
    const [updatedUser, transaction] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { points: newPoints },
      }),
      this.prisma.cashbackTransaction.create({
        data: {
          userId,
          amount,
          type: amount >= 0 ? 'EARNED' : 'SPENT',
          description: reason || (amount >= 0 ? 'Admin tomonidan ball qo\'shildi' : 'Admin tomonidan ball yechildi'),
        },
      }),
    ]);

    return {
      user: updatedUser,
      transaction,
    };
  }

  // Nakopitel va keshbek sozlamalarini yangilash
  async updateSettings(dto: {
    cashbackPercentage?: number;
    minRedeemAmount?: number;
    isEnabled?: boolean;
  }) {
    // Tizim sozlamalari jadvalidan nakopitel parametrlarini o'zgartirish
    const currentSettings = await this.prisma.systemSettings.findFirst() || {};

    return this.prisma.systemSettings.upsert({
      where: { id: 1 },
      update: {
        cashbackPercentage: dto.cashbackPercentage,
        minRedeemAmount: dto.minRedeemAmount,
        isNakopitelEnabled: dto.isEnabled,
      },
      create: {
        id: 1,
        cashbackPercentage: dto.cashbackPercentage ?? 1,
        minRedeemAmount: dto.minRedeemAmount ?? 1000,
        isNakopitelEnabled: dto.isEnabled ?? true,
      },
    });
  }
}
