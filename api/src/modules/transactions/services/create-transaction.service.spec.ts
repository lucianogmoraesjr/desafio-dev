import { NotFoundException } from '@nestjs/common';

import { makeBankAccount } from '@/test/factories/make-bank-account';
import { makeCategory } from '@/test/factories/make-category';
import { InMemoryBankAccountRepository } from '@/test/repositories/in-memory-bank-account.repository';
import { InMemoryCategoryRepository } from '@/test/repositories/in-memory-category.repository';
import { InMemoryTransactionRepository } from '@/test/repositories/in-memory-transaction.repository';

import { TransactionType } from '../entities/transaction.entity';

import { CreateTransactionService } from './create-transaction.service';

let bankAccountRepo: InMemoryBankAccountRepository;
let categoryRepo: InMemoryCategoryRepository;
let transactionRepo: InMemoryTransactionRepository;
let sut: CreateTransactionService;

describe('CreateTransactionService', () => {
  beforeEach(() => {
    categoryRepo = new InMemoryCategoryRepository();
    transactionRepo = new InMemoryTransactionRepository(categoryRepo);
    bankAccountRepo = new InMemoryBankAccountRepository(transactionRepo);
    sut = new CreateTransactionService(
      bankAccountRepo,
      categoryRepo,
      transactionRepo,
    );
  });

  it('should create a transaction', async () => {
    const bankAccount = makeBankAccount({ userId: 'user-123' });
    const category = makeCategory({ userId: 'user-123' });

    await Promise.all([
      bankAccountRepo.create(bankAccount),
      categoryRepo.create(category),
    ]);

    const output = await sut.execute({
      userId: 'user-123',
      bankAccountId: bankAccount.id,
      categoryId: category.id,
      name: 'Salário',
      valueInCents: 500_000,
      date: '2026-08-26T00:00:00.000Z',
      type: TransactionType.INCOME,
    });

    expect(output.id).toBeTruthy();
    expect(transactionRepo.transactions).toHaveLength(1);
    expect(transactionRepo.transactions[0].userId).toBe('user-123');
  });

  it('should throw if bank account does not exist or belongs to another user', async () => {
    const promise = sut.execute({
      userId: 'user-123',
      bankAccountId: 'bank-123',
      name: 'Aluguel',
      valueInCents: 150_000,
      date: '2026-08-26T00:00:00.000Z',
      type: TransactionType.EXPENSE,
    });

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(transactionRepo.transactions).toHaveLength(0);
  });

  it('should throw if category does not exist or belongs to another user', async () => {
    const bankAccount = makeBankAccount({ userId: 'user-123' });

    await Promise.all([bankAccountRepo.create(bankAccount)]);

    const promise = sut.execute({
      userId: 'user-123',
      bankAccountId: bankAccount.id,
      categoryId: 'category-123',
      name: 'Aluguel',
      valueInCents: 150000,
      date: '2026-08-26T00:00:00.000Z',
      type: TransactionType.EXPENSE,
    });

    await expect(promise).rejects.toThrow(NotFoundException);
  });
});
