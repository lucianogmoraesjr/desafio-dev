import { Injectable, NotFoundException } from '@nestjs/common';

import { TransactionRepository } from '../repositories/transaction.repository';

type Input = {
  userId: string;
  transactionId: string;
};

@Injectable()
export class DeleteTransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute({ userId, transactionId }: Input): Promise<void> {
    const transaction = await this.transactionRepository.findByIdAndUser(
      transactionId,
      userId,
    );

    if (!transaction) throw new NotFoundException('Transaction not found');

    await this.transactionRepository.delete(transaction);
  }
}
