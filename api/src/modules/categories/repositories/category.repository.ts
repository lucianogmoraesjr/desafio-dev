import { TransactionType } from '@/modules/transactions/entities/transaction.entity';

import { Category } from '../entities/category.entity';

export abstract class CategoryRepository {
  abstract findManyByUser(
    userId: string,
    type?: TransactionType,
  ): Promise<Category[]>;

  abstract findByIdAndUser(
    id: string,
    userId: string,
  ): Promise<Category | null>;

  abstract findByNameAndUser(
    name: string,
    userId: string,
  ): Promise<Category | null>;

  abstract create(category: Category): Promise<void>;
}
