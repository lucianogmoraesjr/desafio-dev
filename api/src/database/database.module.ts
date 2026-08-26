import { Module } from '@nestjs/common';

import { CategoryRepository } from '@/modules/categories/repositories/category.repository';
import { PrismaCategoryRepository } from '@/modules/categories/repositories/prisma/prisma-category.repository';
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
  ],
  exports: [PrismaService, UserRepository, CategoryRepository],
})
export class DatabaseModule {}
