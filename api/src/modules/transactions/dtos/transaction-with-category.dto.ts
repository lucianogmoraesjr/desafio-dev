import { TransactionType } from '../entities/transaction.entity';

export class TransactionWithCategory {
  id: string;
  bankAccountId: string;
  name: string;
  valueInCents: number;
  date: Date;
  type: TransactionType;
  category?: {
    id: string;
    name: string;
  };
}
