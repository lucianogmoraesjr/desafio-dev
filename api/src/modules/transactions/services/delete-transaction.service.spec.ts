import { NotFoundException } from '@nestjs/common';

import { makeTransaction } from '@/test/factories/make-transaction';
import { InMemoryCategoryRepository } from '@/test/repositories/in-memory-category.repository';
import { InMemoryTransactionRepository } from '@/test/repositories/in-memory-transaction.repository';

import { DeleteTransactionService } from './delete-transaction.service';

let categoryRepo: InMemoryCategoryRepository;
let transactionRepo: InMemoryTransactionRepository;
let sut: DeleteTransactionService;

describe('DeleteTransactionService', () => {
  beforeEach(() => {
    categoryRepo = new InMemoryCategoryRepository();
    transactionRepo = new InMemoryTransactionRepository(categoryRepo);
    sut = new DeleteTransactionService(transactionRepo);
  });

  it('should delete a transaction', async () => {
    const transaction = makeTransaction({ userId: 'user-1' });

    await Promise.all([
      transactionRepo.create(transaction),
      transactionRepo.create(makeTransaction()),
    ]);

    await sut.execute({ userId: 'user-1', transactionId: transaction.id });

    expect(transactionRepo.transactions).toHaveLength(1);
  });

  it('should throw NotFoundException if transaction does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'user-123',
        transactionId: 'transaction-1',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
