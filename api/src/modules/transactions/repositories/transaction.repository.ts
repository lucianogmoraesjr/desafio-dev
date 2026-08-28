import { TransactionWithCategory } from '../dtos/transaction-with-category.dto';
import { Transaction, TransactionType } from '../entities/transaction.entity';

type Filters = {
  month: number;
  year: number;
  bankAccountId?: string;
  type?: TransactionType;
};

export abstract class TransactionRepository {
  abstract create(transaction: Transaction): Promise<void>;
  abstract save(transaction: Transaction): Promise<void>;
  abstract delete(transaction: Transaction): Promise<void>;
  abstract findByIdAndUser(
    id: string,
    userId: string,
  ): Promise<Transaction | null>;
  abstract findManyByUser(
    userId: string,
    filters: Filters,
  ): Promise<TransactionWithCategory[]>;
}
