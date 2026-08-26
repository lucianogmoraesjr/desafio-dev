import { Module } from '@nestjs/common';

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
  ],
  exports: [PrismaService, UserRepository],
})
export class DatabaseModule {}
