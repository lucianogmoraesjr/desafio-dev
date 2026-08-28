import { Injectable } from '@nestjs/common';

import { TransactionType } from '@/modules/transactions/entities/transaction.entity';

import { BankAccountDto } from '../dtos/bank-account.dto';
import { BankAccountRepository } from '../repositories/bank-account.repository';

type Output = BankAccountDto[];

@Injectable()
export class ListBankAccountsService {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  async execute(userId: string): Promise<Output> {
    const bankAccounts =
      await this.bankAccountRepository.findManyByUser(userId);

    return bankAccounts.map(({ transactions, ...ba }) => {
      const totalTransactions = transactions.reduce(
        (acc, { type, valueInCents }) =>
          acc +
          (type === TransactionType.INCOME ? valueInCents : -valueInCents),
        0,
      );

      const currentBalanceInCents =
        ba.initialBalanceInCents + totalTransactions;

      return {
        ...ba,
        currentBalanceInCents,
      };
    });
  }
}
