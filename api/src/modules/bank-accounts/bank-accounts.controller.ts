import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { ActiveUserId } from '@/shared/decorators/active-user-id.decorator';

import { CreateBankAccountDto } from './dtos/create-bank-account.dto';
import { UpdateBankAccountDto } from './dtos/update-bank-account.dto';
import { CreateBankAccountService } from './services/create-bank-account.service';
import { DeleteBankAccountService } from './services/delete-bank-account.service';
import { ListBankAccountsService } from './services/list-bank-accounts.service';
import { UpdateBankAccountService } from './services/update-bank-account.service';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(
    private readonly createBankAccountService: CreateBankAccountService,
    private readonly listBankAccountsService: ListBankAccountsService,
    private readonly deleteBankAccountService: DeleteBankAccountService,
    private readonly updateBankAccountService: UpdateBankAccountService,
  ) {}

  @Post()
  async create(
    @ActiveUserId() userId: string,
    @Body() createBankAccountDto: CreateBankAccountDto,
  ) {
    return this.createBankAccountService.execute({
      userId,
      ...createBankAccountDto,
    });
  }

  @Get()
  async findAll(@ActiveUserId() userId: string) {
    return this.listBankAccountsService.execute(userId);
  }

  @Put(':bankAccountId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @ActiveUserId() userId: string,
    @Param('bankAccountId') bankAccountId: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    return this.updateBankAccountService.execute({
      userId,
      bankAccountId,
      ...updateBankAccountDto,
    });
  }

  @Delete(':bankAccountId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @ActiveUserId() userId: string,
    @Param('bankAccountId') bankAccountId: string,
  ) {
    return this.deleteBankAccountService.execute({ userId, bankAccountId });
  }
}
