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
  Query,
} from '@nestjs/common';

import { ActiveUserId } from '@/shared/decorators/active-user-id.decorator';

import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { ListTransactionsQueryDto } from './dtos/list-transactions-query.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { CreateTransactionService } from './services/create-transaction.service';
import { DeleteTransactionService } from './services/delete-transaction.service';
import { ListTransactionsService } from './services/list-transactions.service';
import { UpdateTransactionService } from './services/update-transaction.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionService: CreateTransactionService,
    private readonly listTransactionsService: ListTransactionsService,
    private readonly updateTransactionService: UpdateTransactionService,
    private readonly deleteTransactionService: DeleteTransactionService,
  ) {}

  @Post()
  async create(
    @ActiveUserId() userId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.createTransactionService.execute({
      userId,
      ...createTransactionDto,
    });
  }

  @Get()
  async findAll(
    @ActiveUserId() userId: string,
    @Query() query: ListTransactionsQueryDto,
  ) {
    return this.listTransactionsService.execute(userId, query);
  }

  @Put(':transactionId')
  async update(
    @ActiveUserId() userId: string,
    @Param('transactionId') transactionId: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.updateTransactionService.execute({
      userId,
      transactionId,
      ...updateTransactionDto,
    });
  }

  @Delete(':transactionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @ActiveUserId() userId: string,
    @Param('transactionId') transactionId: string,
  ) {
    return this.deleteTransactionService.execute({ userId, transactionId });
  }
}
