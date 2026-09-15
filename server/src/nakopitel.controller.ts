import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NakopitelService } from './nakopitel.service';
import { TelegramAuthGuard } from './telegram-auth.guard';
import { AdminAuthGuard } from './admin-auth.guard';

@Controller('nakopitel')
export class NakopitelController {
  constructor(private readonly nakopitelService: NakopitelService) {}

  // Foydalanuvchi o'zining jamg'argan ballari/keshbek balansini ko'rishi
  @Get('my-balance')
  @UseGuards(TelegramAuthGuard)
  async getMyBalance(@Request() req: any) {
    return this.nakopitelService.getUserBalance(req.user.id);
  }

  // Foydalanuvchining ballar va keshbeklar tarixi (Tranzaksiyalar)
  @Get('history')
  @UseGuards(TelegramAuthGuard)
  async getHistory(@Request() req: any) {
    return this.nakopitelService.getUserHistory(req.user.id);
  }

  // Admin tomonidan mijozga qo'lda ball qo'shish yoki ayirish
  @Post('adjust-balance')
  @UseGuards(AdminAuthGuard)
  async adjustBalance(
    @Body()
    dto: {
      userId: number;
      amount: number; // Musbat bo'lsa qo'shiladi, manfiy bo'lsa ayriladi
      reason?: string;
    },
  ) {
    return this.nakopitelService.adjustBalance(
      dto.userId,
      dto.amount,
      dto.reason,
    );
  }

  // Keshbek foizlari va nakopitel qoidalarini sozlash (Admin uchun)
  @Put('settings')
  @UseGuards(AdminAuthGuard)
  async updateSettings(
    @Body()
    dto: {
      cashbackPercentage?: number;
      minRedeemAmount?: number;
      isEnabled?: boolean;
    },
  ) {
    return this.nakopitelService.updateSettings(dto);
  }
}
