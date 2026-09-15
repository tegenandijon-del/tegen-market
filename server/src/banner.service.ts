import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  // Faol bannerlar ro'yxatini olish (Mini App uchun)
  async getActiveBanners() {
    return this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  // Barcha bannerlar ro'yxati (Admin uchun)
  async getAllBanners() {
    return this.prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });
  }

  // Bitta bannerni ID bo'yicha olish
  async getBannerById(id: number) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner topilmadi');
    }

    return banner;
  }

  // Yangi banner yaratish
  async createBanner(dto: {
    title?: string;
    imageUrl: string;
    linkUrl?: string;
    isActive?: boolean;
    order?: number;
  }) {
    return this.prisma.banner.create({
      data: {
        title: dto.title,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl,
        isActive: dto.isActive ?? true,
        order: dto.order ?? 0,
      },
    });
  }

  // Bannerni yangilash
  async updateBanner(
    id: number,
    dto: {
      title?: string;
      imageUrl?: string;
      linkUrl?: string;
      isActive?: boolean;
      order?: number;
    },
  ) {
    await this.getBannerById(id);

    return this.prisma.banner.update({
      where: { id },
      data: dto,
    });
  }

  // Bannerni o'chirish
  async deleteBanner(id: number) {
    await this.getBannerById(id);

    return this.prisma.banner.delete({
      where: { id },
    });
  }
}
