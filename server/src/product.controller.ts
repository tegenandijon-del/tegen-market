import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(@Query('catId') catId?: string) {
    return this.productService.findAll(catId);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post()
  async createProduct(@Body() dto: any) {
    return this.productService.create(dto);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: any) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
