import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { AdminAuthGuard } from './admin-auth.guard';

@Controller('audit')
@UseGuards(AdminAuthGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  // Barcha audit loglarini ko'rish (pagination va userId filteri bilan)
  @Get()
  async getAllLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('userId') userId?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const uId = userId ? parseInt(userId, 10) : undefined;

    return this.auditService.getLogs(pageNum, limitNum, uId);
  }

  // Bitta logni ID bo'yicha ko'rish
  @Get(':id')
  async getLogById(@Param('id', ParseIntPipe) id: number) {
    return this.auditService.getLogById(id);
  }

  // Yangi hodisani qo'lda log qilish (zarur bo'lsa)
  @Post()
  async createLog(
    @Body()
    dto: {
      action: string;
      details?: string;
      userId?: number;
    },
  ) {
    return this.auditService.logAction(dto.action, dto.details, dto.userId);
  }
}
