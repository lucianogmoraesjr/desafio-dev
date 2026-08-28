import { ConflictException, Injectable } from '@nestjs/common';

import { CreateCategoryDto } from '../dtos/create-category.dto';
import { Category } from '../entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';

type Input = CreateCategoryDto & {
  userId: string;
};

type Output = {
  id: string;
};

@Injectable()
export class CreateCategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute({ name, userId, type }: Input): Promise<Output> {
    const categoryExists = await this.categoryRepository.findByNameAndUser(
      name,
      userId,
    );

    if (categoryExists) {
      throw new ConflictException('You already have a category with this name');
    }

    const category = new Category({
      userId,
      name,
      type,
    });

    await this.categoryRepository.create(category);

    return {
      id: category.id,
    };
  }
}
