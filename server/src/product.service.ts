import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoryId?: number) {
    return this.prisma.product.findMany({
      where: categoryId ? { categoryId: Number(categoryId) } : {},
    });
  }

  async findOne(productId: number | string) {
    return this.prisma.product.findUnique({
      where: { id: Number(productId) }, // ID number tipiga o'tkazildi
    });
  }

  async create(dto: any) {
    return this.prisma.product.create({ data: dto });
  }

  async update(id: number | string, dto: any) {
    return this.prisma.product.update({
      where: { id: Number(id) },
      data: dto,
    });
  }

  async remove(id: number | string) {
    return this.prisma.product.delete({
      where: { id: Number(id) },
    });
  }
}
