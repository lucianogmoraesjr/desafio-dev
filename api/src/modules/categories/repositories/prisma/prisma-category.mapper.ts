import { Category as PrismaCategory } from '@/generated/prisma/client';
import { TransactionType } from '@/modules/transactions/entities/transaction.entity';

import { Category } from '../../entities/category.entity';

export class PrismaCategoryMapper {
  static toEntity(raw: PrismaCategory): Category {
    return new Category({
      id: raw.id,
      userId: raw.userId,
      name: raw.name,
      type: TransactionType[raw.type],
      createdAt: raw.createdAt,
    });
  }

  static toPrisma(category: Category): PrismaCategory {
    return {
      id: category.id,
      userId: category.userId,
      name: category.name,
      type: category.type,
      createdAt: category.createdAt,
    };
  }
}
