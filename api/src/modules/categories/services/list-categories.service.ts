import { Injectable } from '@nestjs/common';

import { TransactionType } from '@/modules/transactions/entities/transaction.entity';

import { CategoryRepository } from '../repositories/category.repository';

type Output = {
  id: string;
  name: string;
  type: TransactionType;
  createdAt: Date;
};

@Injectable()
export class ListCategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(userId: string, type?: TransactionType): Promise<Output[]> {
    const categories = await this.categoryRepository.findManyByUser(
      userId,
      type,
    );

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      createdAt: c.createdAt,
    }));
  }
}
