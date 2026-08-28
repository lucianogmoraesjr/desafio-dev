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
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ActiveUserId } from '@/shared/decorators/active-user-id.decorator';

import { CreateTransactionResponseDto } from './dtos/create-transaction-response.dto';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { ListTransactionsQueryDto } from './dtos/list-transactions-query.dto';
import { TransactionWithCategory } from './dtos/transaction-with-category.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { CreateTransactionService } from './services/create-transaction.service';
import { DeleteTransactionService } from './services/delete-transaction.service';
import { ListTransactionsService } from './services/list-transactions.service';
import { UpdateTransactionService } from './services/update-transaction.service';

@ApiTags('Transações')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionService: CreateTransactionService,
    private readonly listTransactionsService: ListTransactionsService,
    private readonly updateTransactionService: UpdateTransactionService,
    private readonly deleteTransactionService: DeleteTransactionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Lançar transação',
    description:
      'Cria uma nova transação (receita ou despesa) associada a uma conta bancária e, opcionalmente, a uma categoria.',
  })
  @ApiCreatedResponse({
    description: 'Transação criada com sucesso.',
    type: CreateTransactionResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Falha de validação. Dados incorretos (ex: valor negativo ou formato de data inválido).',
  })
  @ApiNotFoundResponse({
    description:
      'Conta bancária ou categoria informada não existe ou não pertence ao usuário.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT de acesso ausente, inválido ou expirado.',
  })
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
  @ApiOperation({
    summary: 'Listar transações',
    description:
      'Retorna a lista de transações do usuário, filtrada obrigatoriamente por mês e ano, com filtros opcionais de conta bancária e tipo.',
  })
  @ApiOkResponse({
    description: 'Listagem de transações retornada com sucesso.',
    type: TransactionWithCategory,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT de acesso ausente, inválido ou expirado.',
  })
  async findAll(
    @ActiveUserId() userId: string,
    @Query() query: ListTransactionsQueryDto,
  ): Promise<TransactionWithCategory[]> {
    return this.listTransactionsService.execute(userId, query);
  }

  @Put(':transactionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualizar transação',
    description:
      'Altera os dados de uma transação específica (ex: valor, data, conta, categoria).',
  })
  @ApiParam({
    name: 'transactionId',
    description: 'ID UUID da transação que será atualizada.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({
    description: 'Transação atualizada com sucesso. Sem conteúdo de retorno.',
  })
  @ApiBadRequestResponse({
    description:
      'Falha de validação no corpo da requisição ou ID da transação inválido.',
  })
  @ApiNotFoundResponse({
    description: 'Transação, Conta bancária ou Categoria não encontrada.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT de acesso ausente, inválido ou expirado.',
  })
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
  @ApiOperation({
    summary: 'Excluir transação',
    description:
      'Remove uma transação. Essa ação recalcula e estorna automaticamente o saldo da conta bancária vinculada.',
  })
  @ApiParam({
    name: 'transactionId',
    description: 'ID UUID da transação que será excluída.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({
    description: 'Transação excluída com sucesso. Sem conteúdo de retorno.',
  })
  @ApiNotFoundResponse({
    description: 'Transação não encontrada ou não pertence ao usuário.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT de acesso ausente, inválido ou expirado.',
  })
  async delete(
    @ActiveUserId() userId: string,
    @Param('transactionId') transactionId: string,
  ) {
    return this.deleteTransactionService.execute({ userId, transactionId });
  }
}
