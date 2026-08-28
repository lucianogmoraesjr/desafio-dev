import { Module } from '@nestjs/common';

import { BankAccountRepository } from '@/modules/bank-accounts/repositories/bank-account.repository';
import { PrismaBankAccountRepository } from '@/modules/bank-accounts/repositories/prisma/prisma-bank-account.repository';
import { CategoryRepository } from '@/modules/categories/repositories/category.repository';
import { PrismaCategoryRepository } from '@/modules/categories/repositories/prisma/prisma-category.repository';
import { PrismaTransactionRepository } from '@/modules/transactions/repositories/prisma/prisma-transaction.repository';
import { TransactionRepository } from '@/modules/transactions/repositories/transaction.repository';
import { PrismaUserRepository } from '@/modules/users/repositories/prisma/prisma-user.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';

import { PrismaService } from './prisma.service';

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
    {
      provide: BankAccountRepository,
      useClass: PrismaBankAccountRepository,
    },
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
  ],
  exports: [
    PrismaService,
    UserRepository,
    CategoryRepository,
    BankAccountRepository,
    TransactionRepository,
  ],
})
export class DatabaseModule {}
