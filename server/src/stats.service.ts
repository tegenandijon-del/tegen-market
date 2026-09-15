import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  // Umumiy analitika dashboardi uchun ma'lumotlar
  async getDashboardStats() {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      pendingOrders,
      completedOrders,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.product.count(),
      this.prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: 'DELIVERED',
        },
      }),
      this.prisma.order.count({
        where: { status: 'PENDING' },
      }),
      this.prisma.order.count({
        where: { status: 'DELIVERED' },
      }),
    ]);

    return {
      usersCount: totalUsers,
      ordersCount: totalOrders,
      productsCount: totalProducts,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingOrdersCount: pendingOrders,
      completedOrdersCount: completedOrders,
    };
  }

  // Bo'limlar kesimida sotuvlar va statistikalar (Worker / Department analitikasi uchun)
  async getCategorySalesStats() {
    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        products: {
          select: {
            id: true,
            orderItems: {
              select: {
                quantity: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return categories.map((category) => {
      let totalQuantitySold = 0;
      let totalCategoryRevenue = 0;

      category.products.forEach((product) => {
        product.orderItems.forEach((item) => {
          totalQuantitySold += item.quantity;
          totalCategoryRevenue += item.quantity * item.price;
        });
      });

      return {
        categoryId: category.id,
        categoryName: category.name,
        totalSold: totalQuantitySold,
        totalRevenue: totalCategoryRevenue,
      };
    });
  }

  // Kunlik sotuvlar grafigi uchun ma'lumotlar
  async getDailySalesStats(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'DELIVERED',
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Kunlar bo'yicha guruhlash
    const salesByDay: Record<string, { date: string; revenue: number; ordersCount: number }> = {};

    orders.forEach((order) => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (!salesByDay[dateStr]) {
        salesByDay[dateStr] = { date: dateStr, revenue: 0, ordersCount: 0 };
      }
      salesByDay[dateStr].revenue += order.totalAmount;
      salesByDay[dateStr].ordersCount += 1;
    });

    return Object.values(salesByDay);
  }
}
