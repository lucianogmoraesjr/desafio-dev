import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { CreateTransactionService } from './services/create-transaction.service';
import { DeleteTransactionService } from './services/delete-transaction.service';
import { ListTransactionsService } from './services/list-transactions.service';
import { UpdateTransactionService } from './services/update-transaction.service';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionsController],
  providers: [
    CreateTransactionService,
    ListTransactionsService,
    UpdateTransactionService,
    DeleteTransactionService,
  ],
})
export class TransactionsModule {}
