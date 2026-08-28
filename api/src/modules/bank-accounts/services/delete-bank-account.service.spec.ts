import { NotFoundException } from '@nestjs/common';

import { makeBankAccount } from '@/test/factories/make-bank-account';
import { InMemoryBankAccountRepository } from '@/test/repositories/in-memory-bank-account.repository';
import { InMemoryCategoryRepository } from '@/test/repositories/in-memory-category.repository';
import { InMemoryTransactionRepository } from '@/test/repositories/in-memory-transaction.repository';

import { DeleteBankAccountService } from './delete-bank-account.service';

let categoryRepo: InMemoryCategoryRepository;
let transactionRepo: InMemoryTransactionRepository;
let bankAccountRepo: InMemoryBankAccountRepository;
let sut: DeleteBankAccountService;

describe('DeleteBankAccountService', () => {
  beforeEach(() => {
    categoryRepo = new InMemoryCategoryRepository();
    transactionRepo = new InMemoryTransactionRepository(categoryRepo);
    bankAccountRepo = new InMemoryBankAccountRepository(transactionRepo);
    sut = new DeleteBankAccountService(bankAccountRepo);
  });

  it('should delete a bank account', async () => {
    const bankAccount = makeBankAccount({ userId: 'user-1' });

    await Promise.all([
      bankAccountRepo.create(bankAccount),
      bankAccountRepo.create(makeBankAccount()),
    ]);

    await sut.execute({ userId: 'user-1', bankAccountId: bankAccount.id });

    expect(bankAccountRepo.bankAccounts).toHaveLength(1);
  });

  it('should throw NotFoundException if bank account does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'user-123',
        bankAccountId: 'bank-account1',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
