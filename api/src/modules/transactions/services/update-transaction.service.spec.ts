import { NotFoundException } from '@nestjs/common';

import { makeBankAccount } from '@/test/factories/make-bank-account';
import { makeTransaction } from '@/test/factories/make-transaction';
import { InMemoryBankAccountRepository } from '@/test/repositories/in-memory-bank-account.repository';
import { InMemoryCategoryRepository } from '@/test/repositories/in-memory-category.repository';
import { InMemoryTransactionRepository } from '@/test/repositories/in-memory-transaction.repository';

import { TransactionType } from '../entities/transaction.entity';

import { UpdateTransactionService } from './update-transaction.service';

let categoryRepo: InMemoryCategoryRepository;
let transactionRepo: InMemoryTransactionRepository;
let bankAccountRepo: InMemoryBankAccountRepository;
let sut: UpdateTransactionService;

describe('UpdateTransactionService', () => {
  beforeEach(() => {
    categoryRepo = new InMemoryCategoryRepository();
    transactionRepo = new InMemoryTransactionRepository(categoryRepo);
    bankAccountRepo = new InMemoryBankAccountRepository(transactionRepo);
    sut = new UpdateTransactionService(transactionRepo, bankAccountRepo);
  });

  it('should update a transaction', async () => {
    const transaction = makeTransaction({
      name: 'Mercado',
      userId: 'user-1',
      valueInCents: 10000,
      type: TransactionType.EXPENSE,
    });
    await Promise.all([
      transactionRepo.create(transaction),
      bankAccountRepo.create(
        makeBankAccount({
          id: 'bank-1',
          userId: 'user-1',
        }),
      ),
    ]);

    await sut.execute({
      userId: 'user-1',
      transactionId: transaction.id,
      valueInCents: 15000,
      bankAccountId: 'bank-1',
      date: '2026-08-26T00:00:00.000Z',
      name: 'Internet',
      type: TransactionType.EXPENSE,
    });

    expect(transactionRepo.transactions[0].name).toBe('Internet');
    expect(transactionRepo.transactions[0].valueInCents).toBe(15000);
  });

  it('should throw NotFoundException if transaction does not exist', async () => {
    await expect(
      sut.execute({
        transactionId: 'transaction-1',
        ...makeTransaction(),
        date: '2026-08-26T00:00:00.000Z',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if bank account does not exist', async () => {
    const transaction = makeTransaction();
    await transactionRepo.create(transaction);

    await expect(
      sut.execute({
        transactionId: transaction.id,
        ...transaction,
        date: '2026-08-26T00:00:00.000Z',
        bankAccountId: 'bank-2',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
