import { BankAccount as PrismaBankAccount } from '@/generated/prisma/client';

import {
  BankAccount,
  BankAccountType,
} from '../../entities/bank-account.entity';

export class PrismaBankAccountMapper {
  static toEntity(raw: PrismaBankAccount): BankAccount {
    return new BankAccount({
      id: raw.id,
      userId: raw.userId,
      name: raw.name,
      color: raw.color,
      initialBalanceInCents: raw.initialBalanceInCents,
      type: BankAccountType[raw.type],
      createdAt: raw.createdAt,
    });
  }

  static toPrisma(bankAccount: BankAccount): PrismaBankAccount {
    return {
      id: bankAccount.id,
      userId: bankAccount.userId,
      name: bankAccount.name,
      color: bankAccount.color,
      initialBalanceInCents: bankAccount.initialBalanceInCents,
      type: bankAccount.type,
      createdAt: bankAccount.createdAt,
    };
  }
}
