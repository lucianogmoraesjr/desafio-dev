import { BankAccountWithTransactionsDto } from '../dtos/bank-account-with-transactions.dto';
import { BankAccount } from '../entities/bank-account.entity';

export abstract class BankAccountRepository {
  abstract findByIdAndUser(
    id: string,
    userId: string,
  ): Promise<BankAccount | null>;

  abstract findManyByUser(
    userId: string,
  ): Promise<BankAccountWithTransactionsDto[]>;

  abstract create(bankAccount: BankAccount): Promise<void>;
  abstract save(bankAccount: BankAccount): Promise<void>;
  abstract delete(bankAccount: BankAccount): Promise<void>;
}
