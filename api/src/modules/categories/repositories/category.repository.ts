import { Category } from '../entities/category.entity';

export abstract class CategoryRepository {
  abstract findManyByUser(userId: string): Promise<Category[]>;
  abstract findByNameAndUser(
    name: string,
    userId: string,
  ): Promise<Category | null>;

  abstract create(category: Category): Promise<void>;
}
