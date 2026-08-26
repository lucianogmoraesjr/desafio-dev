import { makeCategory } from '@/test/factories/make-category';
import { InMemoryCategoryRepository } from '@/test/repositories/in-memory-category.repository';

import { ListCategoriesService } from './list-categories.service';

let categoryRepo: InMemoryCategoryRepository;
let sut: ListCategoriesService;

describe('ListCategoriesService', () => {
  beforeEach(() => {
    categoryRepo = new InMemoryCategoryRepository();
    sut = new ListCategoriesService(categoryRepo);
  });

  it('should list categories of a specific user', async () => {
    await Promise.all([
      categoryRepo.create(makeCategory({ name: 'Lazer', userId: 'user-1' })),
      categoryRepo.create(makeCategory({ name: 'Educação', userId: 'user-1' })),
      categoryRepo.create(makeCategory({ userId: 'user-2' })),
    ]);

    const output = await sut.execute('user-1');

    expect(output).toHaveLength(2);
    expect(output).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Lazer' }),
        expect.objectContaining({ name: 'Educação' }),
      ]),
    );
  });
});
