import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { TelegramAuthGuard } from './telegram-auth.guard';
import { AdminAuthGuard } from './admin-auth.guard';

@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  // Bo'lim ishchisi o'z yuborgan taklif va so'rovlarini ko'rishi
  @Get('my-proposals')
  @UseGuards(TelegramAuthGuard)
  async getMyProposals(@Request() req: any) {
    return this.proposalService.getUserProposals(req.user.id);
  }

  // Barcha takliflarni olish (Admin uchun, status bo'yicha filter bilan)
  @Get()
  @UseGuards(AdminAuthGuard)
  async getAllProposals(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.proposalService.getAllProposals(status, pageNum, limitNum);
  }

  // Bitta taklifni ID bo'yicha ko'rish
  @Get(':id')
  @UseGuards(AdminAuthGuard)
  async getProposalById(@Param('id', ParseIntPipe) id: number) {
    return this.proposalService.getProposalById(id);
  }

  // Yangi taklif/mahsulot so'rovini yuborish (Bo'lim ishchilari uchun)
  @Post()
  @UseGuards(TelegramAuthGuard)
  async createProposal(
    @Request() req: any,
    @Body()
    dto: {
      title: string;
      description?: string;
      productData?: any;
    },
  ) {
    return this.proposalService.createProposal(req.user.id, dto);
  }

  // Taklif statusini o'zgartirish (Admin tomonidan tasdiqlash/rad etish)
  @Put(':id/status')
  @UseGuards(AdminAuthGuard)
  async updateProposalStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { status: 'APPROVED' | 'REJECTED'; adminNotes?: string },
  ) {
    return this.proposalService.updateProposalStatus(
      id,
      dto.status,
      dto.adminNotes,
    );
  }

  // Taklifni o'chirish (Admin uchun)
  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  async deleteProposal(@Param('id', ParseIntPipe) id: number) {
    return this.proposalService.deleteProposal(id);
  }
}
