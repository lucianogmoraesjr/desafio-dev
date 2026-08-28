import { Transaction as PrismaTransaction } from '@/generated/prisma/client';

import {
  Transaction,
  TransactionType,
} from '../../entities/transaction.entity';

export class PrismaTransactionMapper {
  static toEntity(raw: PrismaTransaction): Transaction {
    return new Transaction({
      id: raw.id,
      userId: raw.userId,
      bankAccountId: raw.bankAccountId,
      categoryId: raw.categoryId ?? undefined,
      name: raw.name,
      date: raw.date,
      type: TransactionType[raw.type],
      valueInCents: raw.valueInCents,
    });
  }

  static toPrisma(transaction: Transaction): PrismaTransaction {
    return {
      id: transaction.id,
      userId: transaction.userId,
      bankAccountId: transaction.bankAccountId,
      categoryId: transaction.categoryId ?? null,
      name: transaction.name,
      date: transaction.date,
      type: transaction.type,
      valueInCents: transaction.valueInCents,
    };
  }
}
