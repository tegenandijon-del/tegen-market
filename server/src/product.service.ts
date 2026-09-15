import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // Barcha mahsulotlarni olish (Kategoriya filtri bilan)
  async getAllProducts(categoryId?: number) {
    return this.prisma.product.findMany({
      where: categoryId ? { categoryId } : {},
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Bitta mahsulotni ID bo'yicha olish
  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Mahsulot topilmadi');
    }

    return product;
  }

  // Yangi mahsulot yaratish
  async createProduct(dto: {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId: number;
    isAvailable?: boolean;
  }) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
        categoryId: dto.categoryId,
        isAvailable: dto.isAvailable ?? true,
      },
    });
  }

  // Mahsulotni yangilash
  async updateProduct(
    id: number,
    dto: {
      name?: string;
      description?: string;
      price?: number;
      imageUrl?: string;
      categoryId?: number;
      isAvailable?: boolean;
    },
  ) {
    await this.getProductById(id);

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  // Mahsulotni o'chirish
  async deleteProduct(id: number) {
    await this.getProductById(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
