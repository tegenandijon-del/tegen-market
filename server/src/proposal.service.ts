import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProposalService {
  constructor(private prisma: PrismaService) {}

  // Barcha takliflarni olish (Status bo'yicha filter bilan)
  async getAllProposals(status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [proposals, total] = await Promise.all([
      this.prisma.proposal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.proposal.count({ where }),
    ]);

    return {
      data: proposals,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Ishchi (Worker) o'z yuborgan takliflarini ko'rishi
  async getUserProposals(userId: number) {
    return this.prisma.proposal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ID bo'yicha bitta taklifni olish
  async getProposalById(id: number) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!proposal) {
      throw new NotFoundException('Taklif topilmadi');
    }

    return proposal;
  }

  // Yangi taklif yaratish (Bo'lim ishchilari uchun)
  async createProposal(
    userId: number,
    dto: {
      title: string;
      description?: string;
      productData?: any; // Mahsulot qo'shish yoki o'zgartirish taklifi ma'lumotlari
    },
  ) {
    return this.prisma.proposal.create({
      data: {
        title: dto.title,
        description: dto.description,
        productData: dto.productData ? JSON.stringify(dto.productData) : null,
        userId,
        status: 'PENDING',
      },
    });
  }

  // Taklif statusini admin tomonidan o'zgartirish (APPROVED, REJECTED)
  async updateProposalStatus(
    id: number,
    status: 'APPROVED' | 'REJECTED',
    adminNotes?: string,
  ) {
    await this.getProposalById(id);

    return this.prisma.proposal.update({
      where: { id },
      data: {
        status,
        adminNotes,
      },
    });
  }

  // Taklifni o'chirish
  async deleteProposal(id: number) {
    await this.getProposalById(id);

    return this.prisma.proposal.delete({
      where: { id },
    });
  }
}
