import { NotFoundException } from '@nestjs/common';

import { makeUser } from '@/test/factories/make-user';
import { InMemoryBankAccountRepository } from '@/test/repositories/in-memory-bank-account.repository';
import { InMemoryCategoryRepository } from '@/test/repositories/in-memory-category.repository';
import { InMemoryTransactionRepository } from '@/test/repositories/in-memory-transaction.repository';
import { InMemoryUserRepository } from '@/test/repositories/in-memory-user.repository';

import { BankAccountType } from '../entities/bank-account.entity';

import { CreateBankAccountService } from './create-bank-account.service';

let userRepo: InMemoryUserRepository;
let categoryRepo: InMemoryCategoryRepository;
let transactionRepo: InMemoryTransactionRepository;
let bankAccountRepo: InMemoryBankAccountRepository;
let sut: CreateBankAccountService;

describe('CreateBankAccountService', () => {
  beforeEach(() => {
    userRepo = new InMemoryUserRepository();
    categoryRepo = new InMemoryCategoryRepository();
    transactionRepo = new InMemoryTransactionRepository(categoryRepo);
    bankAccountRepo = new InMemoryBankAccountRepository(transactionRepo);
    sut = new CreateBankAccountService(userRepo, bankAccountRepo);
  });

  it('should create a new bank account', async () => {
    const user = makeUser();
    await userRepo.create(user);

    const output = await sut.execute({
      userId: user.id,
      name: 'Nubank',
      color: '#a006a0',
      initialBalanceInCents: 10_000,
      type: BankAccountType.CASH,
    });

    expect(output.id).toBeTruthy();
    expect(bankAccountRepo.bankAccounts).toHaveLength(1);
    expect(bankAccountRepo.bankAccounts[0].name).toBe('Nubank');
    expect(bankAccountRepo.bankAccounts[0].userId).toBe(user.id);
    expect(bankAccountRepo.bankAccounts[0].initialBalanceInCents).toBe(10_000);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'user-123',
        name: 'Nubank',
        color: '#a006a0',
        initialBalanceInCents: 10_000,
        type: BankAccountType.CASH,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
