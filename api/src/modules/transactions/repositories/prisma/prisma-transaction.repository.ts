import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

import { TransactionWithCategory } from '../../dtos/transaction-with-category.dto';
import {
  Transaction,
  TransactionType,
} from '../../entities/transaction.entity';
import { TransactionRepository } from '../transaction.repository';

import { PrismaTransactionMapper } from './prisma-transaction.mapper';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByIdAndUser(
    id: string,
    userId: string,
  ): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) return null;

    return PrismaTransactionMapper.toEntity(transaction);
  }

  async findManyByUser(
    userId: string,
    filters: {
      month: number;
      year: number;
      bankAccountId?: string;
      type?: TransactionType;
    },
  ): Promise<TransactionWithCategory[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        bankAccountId: filters.bankAccountId,
        type: filters.type,
        date: {
          gte: new Date(Date.UTC(filters.year, filters.month)),
          lt: new Date(Date.UTC(filters.year, filters.month + 1)),
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return transactions.map((t) => ({
      id: t.id,
      bankAccountId: t.bankAccountId,
      name: t.name,
      valueInCents: t.valueInCents,
      type: TransactionType[t.type],
      date: t.date,
      category: t.category
        ? {
            id: t.category.id,
            name: t.category.name,
          }
        : undefined,
    }));
  }

  async create(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.create({
      data: PrismaTransactionMapper.toPrisma(transaction),
    });
  }

  async save(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: PrismaTransactionMapper.toPrisma(transaction),
    });
  }

  async delete(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id: transaction.id },
    });
  }
}
