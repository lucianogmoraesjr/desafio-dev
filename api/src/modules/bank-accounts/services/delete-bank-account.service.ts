import { Injectable, NotFoundException } from '@nestjs/common';

import { BankAccountRepository } from '../repositories/bank-account.repository';

type Input = {
  userId: string;
  bankAccountId: string;
};

@Injectable()
export class DeleteBankAccountService {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  async execute({ userId, bankAccountId }: Input): Promise<void> {
    const bankAccount = await this.bankAccountRepository.findByIdAndUser(
      bankAccountId,
      userId,
    );

    if (!bankAccount) throw new NotFoundException('Bank Account not found');

    await this.bankAccountRepository.delete(bankAccount);
  }
}
