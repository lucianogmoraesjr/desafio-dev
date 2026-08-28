import { makeTransaction } from '@/test/factories/make-transaction';
import { InMemoryCategoryRepository } from '@/test/repositories/in-memory-category.repository';
import { InMemoryTransactionRepository } from '@/test/repositories/in-memory-transaction.repository';

import { TransactionType } from '../entities/transaction.entity';

import { ListTransactionsService } from './list-transactions.service';

let categoryRepo: InMemoryCategoryRepository;
let transactionRepo: InMemoryTransactionRepository;
let sut: ListTransactionsService;

describe('ListTransactionsService', () => {
  beforeEach(() => {
    categoryRepo = new InMemoryCategoryRepository();
    transactionRepo = new InMemoryTransactionRepository(categoryRepo);
    sut = new ListTransactionsService(transactionRepo);

    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 7, 1));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should list all transactions of a specific user', async () => {
    await Promise.all([
      transactionRepo.create(
        makeTransaction({ name: 'Mercado', userId: 'user-1' }),
      ),
      transactionRepo.create(
        makeTransaction({ name: 'Salário', userId: 'user-1' }),
      ),
      transactionRepo.create(makeTransaction({ userId: 'user-2' })),
    ]);

    const output = await sut.execute('user-1', {
      month: 7,
      year: 2026,
    });

    expect(output).toHaveLength(2);
    expect(output).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Mercado' }),
        expect.objectContaining({ name: 'Salário' }),
      ]),
    );
  });

  it('should list all transactions of type INCOME', async () => {
    await Promise.all([
      transactionRepo.create(
        makeTransaction({
          name: 'Mercado',
          userId: 'user-1',
          type: TransactionType.EXPENSE,
        }),
      ),
      transactionRepo.create(
        makeTransaction({
          name: 'Salário',
          userId: 'user-1',
          type: TransactionType.INCOME,
        }),
      ),
      transactionRepo.create(
        makeTransaction({
          name: 'Freelance',
          userId: 'user-1',
          type: TransactionType.INCOME,
        }),
      ),
      transactionRepo.create(makeTransaction({ userId: 'user-2' })),
    ]);

    const output = await sut.execute('user-1', {
      month: 7,
      year: 2026,
      type: TransactionType.INCOME,
    });

    expect(output).toHaveLength(2);
    expect(output).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Salário',
          type: TransactionType.INCOME,
        }),
        expect.objectContaining({
          name: 'Freelance',
          type: TransactionType.INCOME,
        }),
      ]),
    );
  });

  it('should list all transactions of type EXPENSE', async () => {
    await Promise.all([
      transactionRepo.create(
        makeTransaction({
          name: 'Mercado',
          userId: 'user-1',
          type: TransactionType.EXPENSE,
        }),
      ),
      transactionRepo.create(
        makeTransaction({
          name: 'Internet',
          userId: 'user-1',
          type: TransactionType.EXPENSE,
        }),
      ),
      transactionRepo.create(
        makeTransaction({
          name: 'Salário',
          userId: 'user-1',
          type: TransactionType.INCOME,
        }),
      ),
      transactionRepo.create(makeTransaction({ userId: 'user-2' })),
    ]);

    const output = await sut.execute('user-1', {
      month: 7,
      year: 2026,
      type: TransactionType.EXPENSE,
    });

    expect(output).toHaveLength(2);
    expect(output).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Mercado',
          type: TransactionType.EXPENSE,
        }),
        expect.objectContaining({
          name: 'Internet',
          type: TransactionType.EXPENSE,
        }),
      ]),
    );
  });

  it('should list all transactions filtering by bank account', async () => {
    await Promise.all([
      transactionRepo.create(
        makeTransaction({
          bankAccountId: 'bank-1',
          name: 'Mercado',
          userId: 'user-1',
          type: TransactionType.EXPENSE,
        }),
      ),
      transactionRepo.create(
        makeTransaction({
          bankAccountId: 'bank-1',
          name: 'Internet',
          userId: 'user-1',
          type: TransactionType.EXPENSE,
        }),
      ),
      transactionRepo.create(
        makeTransaction({
          bankAccountId: 'bank-1',
          name: 'Salário',
          userId: 'user-1',
          type: TransactionType.INCOME,
        }),
      ),
      transactionRepo.create(
        makeTransaction({
          bankAccountId: 'bank-2',
          name: 'Salário',
          userId: 'user-1',
          type: TransactionType.INCOME,
        }),
      ),
      transactionRepo.create(makeTransaction({ userId: 'user-2' })),
    ]);

    const output = await sut.execute('user-1', {
      month: 7,
      year: 2026,
      bankAccountId: 'bank-1',
    });

    expect(output).toHaveLength(3);
    expect(output).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Mercado',
          bankAccountId: 'bank-1',
        }),
        expect.objectContaining({
          name: 'Internet',
          bankAccountId: 'bank-1',
        }),
        expect.objectContaining({
          name: 'Salário',
          bankAccountId: 'bank-1',
        }),
      ]),
    );
  });

  it('should list all transactions filtering by month and year', async () => {
    await Promise.all([
      transactionRepo.create(
        makeTransaction({
          name: 'Mercado',
          userId: 'user-1',
          date: new Date(2025, 5, 10),
        }),
      ),
      transactionRepo.create(
        makeTransaction({
          name: 'Internet',
          userId: 'user-1',
          date: new Date(2025, 5, 5),
        }),
      ),
      transactionRepo.create(
        makeTransaction({
          name: 'Salário',
          userId: 'user-1',
        }),
      ),
      transactionRepo.create(
        makeTransaction({
          name: 'Salário',
          userId: 'user-1',
        }),
      ),
      transactionRepo.create(makeTransaction({ userId: 'user-2' })),
    ]);

    const output = await sut.execute('user-1', {
      month: 5,
      year: 2025,
    });

    expect(output).toHaveLength(2);
    expect(output).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Mercado',
          date: new Date(2025, 5, 10),
        }),
        expect.objectContaining({
          name: 'Internet',
          date: new Date(2025, 5, 5),
        }),
      ]),
    );
  });
});
