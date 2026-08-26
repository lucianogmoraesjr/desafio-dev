import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ActiveUserId } from '@/shared/decorators/active-user-id.decorator';

import { GetUserService } from './services/get-user.service';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly getUserService: GetUserService) {}

  @Get('me')
  async me(@ActiveUserId() userId: string) {
    return this.getUserService.execute(userId);
  }
}
