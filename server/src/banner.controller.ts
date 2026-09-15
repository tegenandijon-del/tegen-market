import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { AdminAuthGuard } from './admin-auth.guard';

@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  // Barcha aktiv bannerlarni olish (Public / Mini App uchun)
  @Get()
  async getAllBanners() {
    return this.bannerService.getAllBanners();
  }

  // Bitta bannerni ID bo'yicha olish
  @Get(':id')
  async getBannerById(@Param('id', ParseIntPipe) id: number) {
    return this.bannerService.getBannerById(id);
  }

  // Yangi banner yaratish (Faqat Admin uchun)
  @Post()
  @UseGuards(AdminAuthGuard)
  async createBanner(
    @Body() dto: { title?: string; imageUrl: string; link?: string; isActive?: boolean },
  ) {
    return this.bannerService.createBanner(dto);
  }

  // Bannerni yangilash (Faqat Admin uchun)
  @Put(':id')
  @UseGuards(AdminAuthGuard)
  async updateBanner(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { title?: string; imageUrl?: string; link?: string; isActive?: boolean },
  ) {
    return this.bannerService.updateBanner(id, dto);
  }

  // Bannerni o'chirish (Faqat Admin uchun)
  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  async deleteBanner(@Param('id', ParseIntPipe) id: number) {
    return this.bannerService.deleteBanner(id);
  }
}
