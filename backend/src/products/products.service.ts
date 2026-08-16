import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '../database/prisma-client';
import { PrismaService } from '../database/prisma.service';
import { ProductNotFoundException } from '../common/errors/domain.exception';
import { FindProductsQueryDto } from './dto/find-products-query.dto';

const DEFAULT_LIMIT = 24;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindProductsQueryDto): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { category: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.category = { equals: query.category, mode: 'insensitive' };
    }

    return this.prisma.product.findMany({
      where,
      orderBy: this.buildOrderBy(query.sort),
      take: query.limit ?? DEFAULT_LIMIT,
    });
  }

  async findById(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    return product;
  }

  async findCategories(): Promise<string[]> {
    const rows = await this.prisma.product.findMany({
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    });

    return rows.map((row) => row.category);
  }

  private buildOrderBy(
    sort?: FindProductsQueryDto['sort'],
  ): Prisma.ProductOrderByWithRelationInput {
    switch (sort) {
      case 'price_asc':
        return { priceCents: 'asc' };
      case 'price_desc':
        return { priceCents: 'desc' };
      case 'rating':
        return { rating: 'desc' };
      default:
        return { createdAt: 'asc' };
    }
  }
}
