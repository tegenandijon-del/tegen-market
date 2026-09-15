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
import { OrderService } from './order.service';
import { TelegramAuthGuard } from './telegram-auth.guard';
import { AdminAuthGuard } from './admin-auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Foydalanuvchining o'z buyurtmalarini olish (Mini App)
  @Get('my-orders')
  @UseGuards(TelegramAuthGuard)
  async getMyOrders(@Request() req: any) {
    return this.orderService.getUserOrders(req.user.id);
  }

  // Barcha buyurtmalar ro'yxati (Admin va ishchilar uchun)
  @Get()
  @UseGuards(AdminAuthGuard)
  async getAllOrders(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.orderService.getAllOrders(status, pageNum, limitNum);
  }

  // Bitta buyurtmani ID bo'yicha ko'rish
  @Get(':id')
  @UseGuards(TelegramAuthGuard)
  async getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
  }

  // Yangi buyurtma berish
  @Post()
  @UseGuards(TelegramAuthGuard)
  async createOrder(
    @Request() req: any,
    @Body()
    dto: {
      items: { productId: number; quantity: number }[];
      address?: string;
      phone?: string;
      notes?: string;
    },
  ) {
    return this.orderService.createOrder(req.user.id, dto);
  }

  // Buyurtma holatini yangilash (PENDING, APPROVED, DELIVERED, CANCELLED)
  @Put(':id/status')
  @UseGuards(AdminAuthGuard)
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.orderService.updateOrderStatus(id, status);
  }

  // Buyurtmani bekor qilish
  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  async cancelOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.cancelOrder(id);
  }
}
