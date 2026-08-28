import { Injectable, NotFoundException } from '@nestjs/common';

import { BankAccountRepository } from '@/modules/bank-accounts/repositories/bank-account.repository';
import { CategoryRepository } from '@/modules/categories/repositories/category.repository';

import { CreateTransactionResponseDto } from '../dtos/create-transaction-response.dto';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { Transaction } from '../entities/transaction.entity';
import { TransactionRepository } from '../repositories/transaction.repository';

type Input = CreateTransactionDto & {
  userId: string;
};

type Output = CreateTransactionResponseDto;

@Injectable()
export class CreateTransactionService {
  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute({
    bankAccountId,
    date,
    name,
    type,
    userId,
    valueInCents,
    categoryId,
  }: Input): Promise<Output> {
    const bankAccount = await this.bankAccountRepository.findByIdAndUser(
      bankAccountId,
      userId,
    );

    if (!bankAccount) {
      throw new NotFoundException('Bank account not found');
    }

    if (categoryId) {
      const category = await this.categoryRepository.findByIdAndUser(
        categoryId,
        userId,
      );

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const transaction = new Transaction({
      userId,
      bankAccountId,
      date: new Date(date),
      name,
      type,
      valueInCents,
      categoryId,
    });

    await this.transactionRepository.create(transaction);

    return {
      id: transaction.id,
    };
  }
}
