import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // Faqat tasdiqlangan (APPROVED) mahsulotlarni Mini App katalogiga chiqarish
  async getApprovedProducts() {
    return this.prisma.product.findMany({
      where: { status: ProductStatus.APPROVED },
      include: { author: true },
    });
  }

  // Bo'lim xodimi (masalan, Nonchi) mahsulot qo'shganda PENDING holatda tushishi
  async createByWorker(data: any, workerTelegramId: bigint) {
    const worker = await this.prisma.user.findUnique({ where: { telegramId: workerTelegramId } });

    return this.prisma.product.create({
      data: {
        ...data,
        authorId: worker.id,
        department: worker.department,
        status: ProductStatus.PENDING,
      },
    });
  }

  // Admin (Asad yoki A'lo) mahsulotni tasdiqlashi
  async approveProduct(productId: string, adminTelegramId: bigint) {
    const admin = await this.prisma.user.findUnique({ where: { telegramId: adminTelegramId } });

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        status: ProductStatus.APPROVED,
        approvedById: admin.id,
      },
    });
  }
}
