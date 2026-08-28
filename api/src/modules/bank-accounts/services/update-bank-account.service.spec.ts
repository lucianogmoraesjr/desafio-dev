import { NotFoundException } from '@nestjs/common';

import { makeBankAccount } from '@/test/factories/make-bank-account';
import { InMemoryBankAccountRepository } from '@/test/repositories/in-memory-bank-account.repository';
import { InMemoryCategoryRepository } from '@/test/repositories/in-memory-category.repository';
import { InMemoryTransactionRepository } from '@/test/repositories/in-memory-transaction.repository';

import { BankAccountType } from '../entities/bank-account.entity';

import { UpdateBankAccountService } from './update-bank-account.service';

let categoryRepo: InMemoryCategoryRepository;
let transactionRepo: InMemoryTransactionRepository;
let bankAccountRepo: InMemoryBankAccountRepository;
let sut: UpdateBankAccountService;

describe('UpdateBankAccountService', () => {
  beforeEach(() => {
    categoryRepo = new InMemoryCategoryRepository();
    transactionRepo = new InMemoryTransactionRepository(categoryRepo);
    bankAccountRepo = new InMemoryBankAccountRepository(transactionRepo);
    sut = new UpdateBankAccountService(bankAccountRepo);
  });

  it('should update a bank account', async () => {
    const bankAccount = makeBankAccount({
      userId: 'user-1',
      initialBalanceInCents: 0,
    });
    await bankAccountRepo.create(bankAccount);

    await sut.execute({
      userId: 'user-1',
      bankAccountId: bankAccount.id,
      name: 'NewBank',
      color: '#0000ff',
      initialBalanceInCents: 10_000,
      type: BankAccountType.CHECKING,
    });

    expect(bankAccountRepo.bankAccounts[0].name).toBe('NewBank');
    expect(bankAccountRepo.bankAccounts[0].color).toBe('#0000ff');
    expect(bankAccountRepo.bankAccounts[0].initialBalanceInCents).toBe(10_000);
    expect(bankAccountRepo.bankAccounts[0].type).toBe(BankAccountType.CHECKING);
  });

  it('should throw NotFoundException if bank account does not exist', async () => {
    await expect(
      sut.execute({ bankAccountId: 'bank-1', ...makeBankAccount() }),
    ).rejects.toThrow(NotFoundException);
  });
});
