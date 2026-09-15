import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('sales')
  async getSalesStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.statsService.getStats(startDate, endDate);
  }

  @Get('top-products')
  async getTopProducts(@Query('limit') limitNum?: string) {
    const limit = limitNum ? parseInt(limitNum, 10) : 10;
    return this.statsService.getTopProducts(limit);
  }
}
