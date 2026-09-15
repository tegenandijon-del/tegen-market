import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { CategoryService } from './category.service';
import { UserService } from './user.service';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { BannerService } from './banner.service';

@Module({
  imports: [],
  controllers: [ProductController, AuditController, StatsController],
  providers: [
    PrismaService,
    ProductService,
    AuditService,
    CategoryService,
    UserService,
    StatsService,
    BannerService,
  ],
})
export class AppModule {}
