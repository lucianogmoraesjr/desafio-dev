import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { GetUserService } from './services/get-user.service';
import { UsersController } from './users.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [GetUserService],
})
export class UsersModule {}
