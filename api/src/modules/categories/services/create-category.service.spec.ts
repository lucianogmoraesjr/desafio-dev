import { ConflictException } from '@nestjs/common';

import { TransactionType } from '@/modules/transactions/entities/transaction.entity';
import { makeCategory } from '@/test/factories/make-category';
import { InMemoryCategoryRepository } from '@/test/repositories/in-memory-category.repository';

import { CreateCategoryService } from './create-category.service';

let categoryRepo: InMemoryCategoryRepository;
let sut: CreateCategoryService;

describe('CreateCategoryService', () => {
  beforeEach(() => {
    categoryRepo = new InMemoryCategoryRepository();
    sut = new CreateCategoryService(categoryRepo);
  });

  it('should create a new category', async () => {
    const output = await sut.execute({
      name: 'Alimentação',
      userId: 'user-123',
      type: TransactionType.EXPENSE,
    });

    expect(output.id).toBeTruthy();
    expect(categoryRepo.categories).toHaveLength(1);
    expect(categoryRepo.categories[0].name).toBe('Alimentação');
    expect(categoryRepo.categories[0].userId).toBe('user-123');
  });

  it('should not create a category with an existing name for the same user', async () => {
    await categoryRepo.create(
      makeCategory({
        name: 'Salário',
        userId: 'user-123',
      }),
    );

    await expect(
      sut.execute({
        name: 'Salário',
        userId: 'user-123',
        type: TransactionType.INCOME,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should create a category with the same name for different users', async () => {
    await categoryRepo.create(
      makeCategory({
        name: 'Salário',
        userId: 'user-123',
      }),
    );

    const output = await sut.execute({
      name: 'Salário',
      userId: 'user-456',
      type: TransactionType.INCOME,
    });

    expect(output.id).toBeTruthy();
    expect(categoryRepo.categories).toHaveLength(2);
  });
});
