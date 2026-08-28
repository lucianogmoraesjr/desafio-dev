import { TransactionWithCategory } from '@/modules/transactions/dtos/transaction-with-category.dto';
import {
  Transaction,
  TransactionType,
} from '@/modules/transactions/entities/transaction.entity';
import { TransactionRepository } from '@/modules/transactions/repositories/transaction.repository';

import { InMemoryCategoryRepository } from './in-memory-category.repository';

export class InMemoryTransactionRepository implements TransactionRepository {
  constructor(private readonly categoryRepo: InMemoryCategoryRepository) {}

  public transactions: Transaction[] = [];

  create(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
    return Promise.resolve();
  }

  save(transaction: Transaction): Promise<void> {
    const index = this.transactions.findIndex((t) => t.id === transaction.id);
    this.transactions[index] = transaction;
    return Promise.resolve();
  }

  delete(transaction: Transaction): Promise<void> {
    const index = this.transactions.findIndex((t) => t.id === transaction.id);
    this.transactions.splice(index, 1);
    return Promise.resolve();
  }

  findByIdAndUser(id: string, userId: string): Promise<Transaction | null> {
    const transaction = this.transactions.find(
      (t) => t.id === id && t.userId === userId,
    );

    if (!transaction) return Promise.resolve(null);
    return Promise.resolve(transaction);
  }

  findManyByUser(
    userId: string,
    filters: {
      month: number;
      year: number;
      bankAccountId?: string;
      type?: TransactionType;
    },
  ): Promise<TransactionWithCategory[]> {
    const transactions = this.transactions.filter((t) => {
      if (t.userId !== userId) return false;
      if (t.date.getMonth() !== filters.month) return false;
      if (t.date.getFullYear() !== filters.year) return false;
      if (filters.type && t.type !== filters.type) return false;

      if (filters.bankAccountId && t.bankAccountId !== filters.bankAccountId) {
        return false;
      }

      return true;
    });

    const categoryIds = new Set(
      transactions.map((t) => t.categoryId).filter((id): id is string => !!id),
    );

    const categoriesMap = new Map(
      this.categoryRepo.categories
        .filter((c) => c.userId === userId && categoryIds.has(c.id))
        .map((c) => [c.id, c]),
    );

    return Promise.resolve(
      transactions.map((t) => ({
        id: t.id,
        bankAccountId: t.bankAccountId,
        name: t.name,
        valueInCents: t.valueInCents,
        date: t.date,
        type: t.type,
        category: t.categoryId ? categoriesMap.get(t.categoryId) : undefined,
      })),
    );
  }
}
