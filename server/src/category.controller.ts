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
import { CategoryService } from './category.service';
import { AdminAuthGuard } from './admin-auth.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Barcha kategoriyalarni olish (Public / Mini App uchun)
  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  // Bitta kategoriyani ID bo'yicha olish
  @Get(':id')
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategoryById(id);
  }

  // Yangi kategoriya yaratish (Faqat Admin uchun)
  @Post()
  @UseGuards(AdminAuthGuard)
  async createCategory(
    @Body() dto: { name: string; icon?: string; sortOrder?: number },
  ) {
    return this.categoryService.createCategory(dto);
  }

  // Kategoriyani yangilash (Faqat Admin uchun)
  @Put(':id')
  @UseGuards(AdminAuthGuard)
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { name?: string; icon?: string; sortOrder?: number },
  ) {
    return this.categoryService.updateCategory(id, dto);
  }

  // Kategoriyani o'chirish (Faqat Admin uchun)
  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
