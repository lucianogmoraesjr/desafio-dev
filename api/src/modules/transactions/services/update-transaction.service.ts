import { Injectable, NotFoundException } from '@nestjs/common';

import { BankAccountRepository } from '@/modules/bank-accounts/repositories/bank-account.repository';

import { UpdateTransactionDto } from '../dtos/update-transaction.dto';
import { TransactionRepository } from '../repositories/transaction.repository';

type Input = UpdateTransactionDto & {
  userId: string;
  transactionId: string;
};

@Injectable()
export class UpdateTransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly bankAccountRepository: BankAccountRepository,
  ) {}

  async execute({
    userId,
    transactionId,
    bankAccountId,
    date,
    name,
    type,
    valueInCents,
    categoryId,
  }: Input): Promise<void> {
    const transaction = await this.transactionRepository.findByIdAndUser(
      transactionId,
      userId,
    );

    if (!transaction) throw new NotFoundException('Transaction not found');

    if (bankAccountId && transaction.bankAccountId !== bankAccountId) {
      const accountExists = await this.bankAccountRepository.findByIdAndUser(
        bankAccountId,
        userId,
      );

      if (!accountExists) throw new NotFoundException('Bank Account not found');
    }

    transaction.update({
      bankAccountId,
      date: new Date(date),
      name,
      type,
      valueInCents,
      categoryId,
    });

    await this.transactionRepository.save(transaction);
  }
}
