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
import { UserService } from './user.service';
import { AdminAuthGuard } from './admin-auth.guard';
import { TelegramAuthGuard } from './telegram-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Telegram WebApp orqali kirgan foydalanuvchi o'z profilini olishi/yaratishi
  @Get('me')
  @UseGuards(TelegramAuthGuard)
  async getProfile(@Request() req: any) {
    return this.userService.findOrCreateUser(req.user);
  }

  // Barcha foydalanuvchilar ro'yxatini olish (Admin uchun, rol va pagination filtri bilan)
  @Get()
  @UseGuards(AdminAuthGuard)
  async getAllUsers(
    @Query('role') role?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.userService.getAllUsers(role, pageNum, limitNum);
  }

  // Bitta foydalanuvchini ID bo'yicha olish (Admin uchun)
  @Get(':id')
  @UseGuards(AdminAuthGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  // Foydalanuvchi rolini yangilash (ADMIN, WORKER, USER)
  @Put(':id/role')
  @UseGuards(AdminAuthGuard)
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: string,
  ) {
    return this.userService.updateRole(id, role);
  }

  // Foydalanuvchini bloklash yoki o'chirish
  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
