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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AdminAuthGuard } from './admin-auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Barcha mahsulotlarni olish (Kategoriya bo'yicha filter qilish imkoniyati bilan)
  @Get()
  async getAllProducts(@Query('categoryId') categoryId?: string) {
    const catId = categoryId ? parseInt(categoryId, 10) : undefined;
    return this.productService.getAllProducts(catId);
  }

  // Bitta mahsulotni ID bo'yicha olish
  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  // Yangi mahsulot yaratish (Admin va biriktirilgan ishchilar uchun)
  @Post()
  @UseGuards(AdminAuthGuard)
  async createProduct(
    @Body()
    dto: {
      name: string;
      description?: string;
      price: number;
      imageUrl?: string;
      categoryId: number;
      isAvailable?: boolean;
    },
  ) {
    return this.productService.createProduct(dto);
  }

  // Mahsulot ma'lumotlarini yangilash
  @Put(':id')
  @UseGuards(AdminAuthGuard)
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    dto: {
      name?: string;
      description?: string;
      price?: number;
      imageUrl?: string;
      categoryId?: number;
      isAvailable?: boolean;
    },
  ) {
    return this.productService.updateProduct(id, dto);
  }

  // Mahsulotni o'chirish
  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}
