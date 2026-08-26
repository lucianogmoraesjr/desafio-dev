import { Category } from '@/modules/categories/entities/category.entity';
import { CategoryRepository } from '@/modules/categories/repositories/category.repository';

export class InMemoryCategoryRepository implements CategoryRepository {
  public categories: Category[] = [];

  findByNameAndUser(name: string, userId: string): Promise<Category | null> {
    const category = this.categories.find(
      (c) => c.name === name && c.userId === userId,
    );

    if (!category) return Promise.resolve(null);

    return Promise.resolve(category);
  }

  findManyByUser(userId: string): Promise<Category[]> {
    return Promise.resolve(this.categories.filter((c) => c.userId === userId));
  }

  create(category: Category): Promise<void> {
    this.categories.push(category);
    return Promise.resolve();
  }
}
