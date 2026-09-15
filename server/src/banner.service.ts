import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  async getActiveBanners() {
    return this.prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  }

  async getAllBanners() {
    return this.prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async createBanner(dto: { title?: string; imageUrl: string; linkUrl?: string; order?: number }) {
    return this.prisma.banner.create({
      data: {
        title: dto.title,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl,
        order: dto.order ?? 0,
      },
    });
  }
}
