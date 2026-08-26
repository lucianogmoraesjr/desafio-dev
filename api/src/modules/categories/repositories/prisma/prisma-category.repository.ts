import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

import { Category } from '../../entities/category.entity';
import { CategoryRepository } from '../category.repository';

import { PrismaCategoryMapper } from './prisma-category.mapper';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByUser(userId: string): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { userId },
    });

    return categories.map(PrismaCategoryMapper.toEntity);
  }

  async findByNameAndUser(
    name: string,
    userId: string,
  ): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: { name, userId },
    });

    if (!category) return null;

    return PrismaCategoryMapper.toEntity(category);
  }

  async create(category: Category): Promise<void> {
    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPrisma(category),
    });
  }
}
