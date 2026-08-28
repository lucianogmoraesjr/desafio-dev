import { Injectable } from '@nestjs/common';

import { ListTransactionsQueryDto } from '../dtos/list-transactions-query.dto';
import { TransactionWithCategory } from '../dtos/transaction-with-category.dto';
import { TransactionRepository } from '../repositories/transaction.repository';

type Output = TransactionWithCategory[];

@Injectable()
export class ListTransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(
    userId: string,
    query: ListTransactionsQueryDto,
  ): Promise<Output> {
    const transactions = await this.transactionRepository.findManyByUser(
      userId,
      query,
    );

    return transactions;
  }
}
