import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { UserController } from './user.controller';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { NakopitelController } from './nakopitel.controller';
import { NakopitelService } from './nakopitel.service';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    UserController,
    ProductController,
    CategoryController,
    OrderController,
    BannerController,
    SupportController,
    AuditController,
    StatsController,
    NakopitelController,
    ProposalController,
  ],
  providers: [
    PrismaService,
    ProductService,
    CategoryService,
    OrderService,
    BannerService,
    SupportService,
    AuditService,
    StatsService,
    NakopitelService,
    ProposalService,
  ],
})
export class AppModule {}
