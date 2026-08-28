import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { BankAccountsController } from './bank-accounts.controller';
import { CreateBankAccountService } from './services/create-bank-account.service';
import { DeleteBankAccountService } from './services/delete-bank-account.service';
import { ListBankAccountsService } from './services/list-bank-accounts.service';
import { UpdateBankAccountService } from './services/update-bank-account.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BankAccountsController],
  providers: [
    CreateBankAccountService,
    ListBankAccountsService,
    DeleteBankAccountService,
    UpdateBankAccountService,
  ],
})
export class BankAccountsModule {}
