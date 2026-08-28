import { BankAccountWithTransactionsDto } from '@/modules/bank-accounts/dtos/bank-account-with-transactions.dto';
import { BankAccount } from '@/modules/bank-accounts/entities/bank-account.entity';
import { BankAccountRepository } from '@/modules/bank-accounts/repositories/bank-account.repository';
import { Transaction } from '@/modules/transactions/entities/transaction.entity';

import { InMemoryTransactionRepository } from './in-memory-transaction.repository';

export class InMemoryBankAccountRepository implements BankAccountRepository {
  constructor(
    private readonly transactionsRepo: InMemoryTransactionRepository,
  ) {}

  public bankAccounts: BankAccount[] = [];

  findByIdAndUser(id: string, userId: string): Promise<BankAccount | null> {
    const bankAccount = this.bankAccounts.find(
      (ba) => ba.id === id && ba.userId === userId,
    );

    if (!bankAccount) return Promise.resolve(null);

    return Promise.resolve(bankAccount);
  }

  findManyByUser(userId: string): Promise<BankAccountWithTransactionsDto[]> {
    const bankAccounts = this.bankAccounts.filter((ba) => ba.userId === userId);
    const bankAccountIds = new Set(bankAccounts.map((ba) => ba.id));
    const transactionsByBankAccountMap = new Map<string, Transaction[]>();

    for (const t of this.transactionsRepo.transactions) {
      if (!bankAccountIds.has(t.bankAccountId)) continue;

      const transactions =
        transactionsByBankAccountMap.get(t.bankAccountId) ?? [];

      transactions.push(t);
      transactionsByBankAccountMap.set(t.bankAccountId, transactions);
    }

    return Promise.resolve(
      bankAccounts.map((ba) => ({
        ...ba,
        transactions: transactionsByBankAccountMap.get(ba.id) ?? [],
      })),
    );
  }

  create(bankAccount: BankAccount): Promise<void> {
    this.bankAccounts.push(bankAccount);
    return Promise.resolve();
  }

  save(bankAccount: BankAccount): Promise<void> {
    const index = this.bankAccounts.findIndex((ba) => ba.id === bankAccount.id);
    this.bankAccounts[index] = bankAccount;
    return Promise.resolve();
  }

  delete(bankAccount: BankAccount): Promise<void> {
    const index = this.bankAccounts.findIndex((ba) => ba.id === bankAccount.id);
    this.bankAccounts.splice(index, 1);
    return Promise.resolve();
  }
}
