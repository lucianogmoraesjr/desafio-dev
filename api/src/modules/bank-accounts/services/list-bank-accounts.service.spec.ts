import { TransactionType } from '@/modules/transactions/entities/transaction.entity';
import { makeBankAccount } from '@/test/factories/make-bank-account';
import { makeTransaction } from '@/test/factories/make-transaction';
import { InMemoryBankAccountRepository } from '@/test/repositories/in-memory-bank-account.repository';
import { InMemoryCategoryRepository } from '@/test/repositories/in-memory-category.repository';
import { InMemoryTransactionRepository } from '@/test/repositories/in-memory-transaction.repository';

import { ListBankAccountsService } from './list-bank-accounts.service';

let categoryRepo: InMemoryCategoryRepository;
let transactionsRepo: InMemoryTransactionRepository;
let bankAccountRepo: InMemoryBankAccountRepository;
let sut: ListBankAccountsService;

describe('ListBankAccountsService', () => {
  beforeEach(() => {
    categoryRepo = new InMemoryCategoryRepository();
    transactionsRepo = new InMemoryTransactionRepository(categoryRepo);
    bankAccountRepo = new InMemoryBankAccountRepository(transactionsRepo);
    sut = new ListBankAccountsService(bankAccountRepo);
  });

  it('should list bank accounts of a specific user', async () => {
    await Promise.all([
      bankAccountRepo.create(makeBankAccount({ userId: 'user-1' })),
      bankAccountRepo.create(makeBankAccount({ userId: 'user-1' })),
      bankAccountRepo.create(makeBankAccount({ userId: 'user-2' })),
    ]);

    const output = await sut.execute('user-1');

    expect(output).toHaveLength(2);
    expect(bankAccountRepo.bankAccounts).toHaveLength(3);
  });

  it('should list bank accounts of a specific user with current balance', async () => {
    const bankAccount = makeBankAccount({
      userId: 'user-1',
      initialBalanceInCents: 0,
    });

    await Promise.all([
      transactionsRepo.create(
        makeTransaction({
          bankAccountId: bankAccount.id,
          type: TransactionType.INCOME,
          valueInCents: 1_000 * 100,
        }),
      ),
      transactionsRepo.create(
        makeTransaction({
          bankAccountId: bankAccount.id,
          type: TransactionType.EXPENSE,
          valueInCents: 100 * 100,
        }),
      ),
      transactionsRepo.create(
        makeTransaction({
          bankAccountId: bankAccount.id,
          type: TransactionType.EXPENSE,
          valueInCents: 250 * 100,
        }),
      ),
      transactionsRepo.create(makeTransaction()),
    ]);

    await Promise.all([
      bankAccountRepo.create(makeBankAccount({ userId: 'user-2' })),
      bankAccountRepo.create(bankAccount),
    ]);

    const output = await sut.execute('user-1');

    expect(output).toHaveLength(1);
    expect(output[0].currentBalanceInCents).toBe(650 * 100);
    expect(bankAccountRepo.bankAccounts).toHaveLength(2);
  });
});
