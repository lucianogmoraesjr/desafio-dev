import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateBankAccountDto } from '../dtos/update-bank-account.dto';
import { BankAccountRepository } from '../repositories/bank-account.repository';

type Input = UpdateBankAccountDto & {
  userId: string;
  bankAccountId: string;
};

@Injectable()
export class UpdateBankAccountService {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  async execute({
    userId,
    bankAccountId,
    color,
    initialBalanceInCents,
    name,
    type,
  }: Input): Promise<void> {
    const bankAccount = await this.bankAccountRepository.findByIdAndUser(
      bankAccountId,
      userId,
    );

    if (!bankAccount) throw new NotFoundException('Bank account not found');

    bankAccount.update({
      color,
      initialBalanceInCents,
      name,
      type,
    });

    await this.bankAccountRepository.save(bankAccount);
  }
}
