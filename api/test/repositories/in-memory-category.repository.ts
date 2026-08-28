import { Category } from '@/modules/categories/entities/category.entity';
import { CategoryRepository } from '@/modules/categories/repositories/category.repository';
import { TransactionType } from '@/modules/transactions/entities/transaction.entity';

export class InMemoryCategoryRepository implements CategoryRepository {
  public categories: Category[] = [];

  findByIdAndUser(id: string, userId: string): Promise<Category | null> {
    const category = this.categories.find(
      (c) => c.id === id && c.userId === userId,
    );

    if (!category) return Promise.resolve(null);

    return Promise.resolve(category);
  }

  findByNameAndUser(name: string, userId: string): Promise<Category | null> {
    const category = this.categories.find(
      (c) => c.name === name && c.userId === userId,
    );

    if (!category) return Promise.resolve(null);

    return Promise.resolve(category);
  }

  findManyByUser(userId: string, type?: TransactionType): Promise<Category[]> {
    return Promise.resolve(
      this.categories.filter((c) => {
        if (type) {
          return c.userId === userId && type === c.type;
        }

        return c.userId === userId;
      }),
    );
  }

  create(category: Category): Promise<void> {
    this.categories.push(category);
    return Promise.resolve();
  }
}
