import { Transaction } from '@/modules/transactions/entities/transaction.entity';

import { BankAccountType } from '../entities/bank-account.entity';

export class BankAccountWithTransactionsDto {
  id: string;
  name: string;
  type: BankAccountType;
  color: string;
  createdAt: Date;
  initialBalanceInCents: number;
  transactions: Transaction[];
}
