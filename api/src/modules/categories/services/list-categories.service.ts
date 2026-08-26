import { Injectable } from '@nestjs/common';

import { CategoryRepository } from '../repositories/category.repository';

type Output = {
  id: string;
  name: string;
  createdAt: Date;
};

@Injectable()
export class ListCategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(userId: string): Promise<Output[]> {
    const categories = await this.categoryRepository.findManyByUser(userId);

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      createdAt: c.createdAt,
    }));
  }
}
