import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { TelegramAuthGuard } from './telegram-auth.guard';
import { AdminAuthGuard } from './admin-auth.guard';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  // Foydalanuvchi o'zining qo'llab-quvvatlash xabarlarini ko'rishi (Mini App)
  @Get('my-tickets')
  @UseGuards(TelegramAuthGuard)
  async getMyTickets(@Request() req: any) {
    return this.supportService.getUserTickets(req.user.id);
  }

  // Barcha murojaatlarni ko'rish (Admin uchun)
  @Get()
  @UseGuards(AdminAuthGuard)
  async getAllTickets() {
    return this.supportService.getAllTickets();
  }

  // Bitta murojaatni ID bo'yicha ko'rish
  @Get(':id')
  @UseGuards(AdminAuthGuard)
  async getTicketById(@Param('id', ParseIntPipe) id: number) {
    return this.supportService.getTicketById(id);
  }

  // Yangi murojaat/xabar yuborish (Foydalanuvchi)
  @Post()
  @UseGuards(TelegramAuthGuard)
  async createTicket(
    @Request() req: any,
    @Body() dto: { subject?: string; message: string },
  ) {
    return this.supportService.createTicket(req.user.id, dto);
  }

  // Murojaatni o'chirish (Admin uchun)
  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  async deleteTicket(@Param('id', ParseIntPipe) id: number) {
    return this.supportService.deleteTicket(id);
  }
}
