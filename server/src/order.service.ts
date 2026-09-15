import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  // Foydalanuvchining o'z buyurtmalarini olish
  async getUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Barcha buyurtmalarni olish (Admin/Worker uchun, status va pagination filtri bilan)
  async getAllOrders(status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Bitta buyurtmani ID bo'yicha olish
  async getOrderById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Buyurtma topilmadi');
    }

    return order;
  }

  // Yangi buyurtma yaratish
  async createOrder(
    userId: number,
    dto: {
      items: { productId: number; quantity: number }[];
      address?: string;
      phone?: string;
      notes?: string;
    },
  ) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Buyurtmada kamida bitta mahsulot bo\'lishi kerak');
    }

    // Mahsulotlar ID-larini yig'ib olish va bazadan narxlarni tekshirish
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== dto.items.length) {
      throw new BadRequestException('Ba\'zi mahsulotlar topilmadi');
    }

    // Umumiy summani hisoblash
    let totalAmount = 0;
    const orderItemsData = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const itemPrice = product.price * item.quantity;
      totalAmount += itemPrice;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Tranzaksiya orqali buyurtma va uning itemlarini yaratish
    return this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        address: dto.address,
        phone: dto.phone,
        notes: dto.notes,
        status: 'PENDING',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });
  }

  // Buyurtma holatini yangilash
  async updateOrderStatus(id: number, status: string) {
    await this.getOrderById(id);

    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  // Buyurtmani bekor qilish
  async cancelOrder(id: number) {
    await this.getOrderById(id);

    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
