import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { AdminAuthGuard } from './admin-auth.guard';

@Controller('stats')
@UseGuards(AdminAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  // Umumiy statistikani olish (Foydalanuvchilar, buyurtmalar, daromad va h.k.)
  @Get('dashboard')
  async getDashboardStats() {
    return this.statsService.getDashboardStats();
  }

  // Belgilangan sana oralig'i bo'yicha sotuvlar statistikasi
  @Get('sales')
  async getSalesStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.statsService.getSalesStats(startDate, endDate);
  }

  // Eng ko'p sotilgan mahsulotlar statistikasi
  @Get('top-products')
  async getTopProducts(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.statsService.getTopProducts(limitNum);
  }
}
