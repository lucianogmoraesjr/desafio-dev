import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';
import { PrismaTransactionMapper } from '@/modules/transactions/repositories/prisma/prisma-transaction.mapper';

import { BankAccountWithTransactionsDto } from '../../dtos/bank-account-with-transactions.dto';
import {
  BankAccount,
  BankAccountType,
} from '../../entities/bank-account.entity';
import { BankAccountRepository } from '../bank-account.repository';

import { PrismaBankAccountMapper } from './prisma-bank-account.mapper';

@Injectable()
export class PrismaBankAccountRepository implements BankAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByIdAndUser(
    id: string,
    userId: string,
  ): Promise<BankAccount | null> {
    const bankAccount = await this.prisma.bankAccount.findUnique({
      where: { id, userId },
    });

    if (!bankAccount) return null;

    return PrismaBankAccountMapper.toEntity(bankAccount);
  }

  async findManyByUser(
    userId: string,
  ): Promise<BankAccountWithTransactionsDto[]> {
    const bankAccounts = await this.prisma.bankAccount.findMany({
      where: { userId },
      include: { transactions: true },
    });

    return bankAccounts.map((ba) => ({
      id: ba.id,
      name: ba.name,
      color: ba.color,
      initialBalanceInCents: ba.initialBalanceInCents,
      type: BankAccountType[ba.type],
      createdAt: ba.createdAt,
      transactions: ba.transactions.map(PrismaTransactionMapper.toEntity),
    }));
  }

  async create(bankAccount: BankAccount): Promise<void> {
    await this.prisma.bankAccount.create({
      data: PrismaBankAccountMapper.toPrisma(bankAccount),
    });
  }

  async save(bankAccount: BankAccount): Promise<void> {
    await this.prisma.bankAccount.update({
      where: { id: bankAccount.id },
      data: PrismaBankAccountMapper.toPrisma(bankAccount),
    });
  }

  async delete(bankAccount: BankAccount): Promise<void> {
    await this.prisma.bankAccount.delete({
      where: { id: bankAccount.id },
    });
  }
}
