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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { ActiveUserId } from '@/shared/decorators/active-user-id.decorator';

import { BankAccountDto } from './dtos/bank-account.dto';
import { CreateBankAccountResponseDto } from './dtos/create-bank-account-response.dto';
import { CreateBankAccountDto } from './dtos/create-bank-account.dto';
import { UpdateBankAccountDto } from './dtos/update-bank-account.dto';
import { CreateBankAccountService } from './services/create-bank-account.service';
import { DeleteBankAccountService } from './services/delete-bank-account.service';
import { ListBankAccountsService } from './services/list-bank-accounts.service';
import { UpdateBankAccountService } from './services/update-bank-account.service';

@ApiTags('Contas Bancárias')
@ApiBearerAuth()
@Controller('bank-accounts')
export class BankAccountsController {
  constructor(
    private readonly createBankAccountService: CreateBankAccountService,
    private readonly listBankAccountsService: ListBankAccountsService,
    private readonly deleteBankAccountService: DeleteBankAccountService,
    private readonly updateBankAccountService: UpdateBankAccountService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar nova conta bancária',
    description:
      'Cadastra uma nova conta bancária (ex: Conta Corrente, Carteira) vinculada ao usuário autenticado.',
  })
  @ApiCreatedResponse({
    description: 'Conta bancária criada com sucesso.',
    type: CreateBankAccountResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Falha de validação. Os dados enviados não respeitam o formato exigido (ex: formato de cor inválido ou saldo ausente).',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT de acesso ausente, inválido ou expirado.',
  })
  async create(
    @ActiveUserId() userId: string,
    @Body() createBankAccountDto: CreateBankAccountDto,
  ): Promise<CreateBankAccountResponseDto> {
    return this.createBankAccountService.execute({
      userId,
      ...createBankAccountDto,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Listar contas bancárias',
    description:
      'Retorna uma lista com todas as contas bancárias cadastradas pelo usuário autenticado.',
  })
  @ApiOkResponse({
    description: 'Listagem de contas bancárias retornada com sucesso.',
    type: BankAccountDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT de acesso ausente, inválido ou expirado.',
  })
  async findAll(@ActiveUserId() userId: string): Promise<BankAccountDto[]> {
    return this.listBankAccountsService.execute(userId);
  }

  @Put(':bankAccountId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualizar conta bancária',
    description:
      'Altera os dados de uma conta bancária existente que pertence ao usuário.',
  })
  @ApiParam({
    name: 'bankAccountId',
    description: 'ID UUID da conta bancária que será atualizada.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({
    description:
      'Conta bancária atualizada com sucesso. Não há conteúdo no corpo da resposta.',
  })
  @ApiBadRequestResponse({
    description:
      'Falha de validação no corpo da requisição ou ID da conta inválido.',
  })
  @ApiNotFoundResponse({
    description:
      'A conta bancária informada não foi encontrada ou não pertence a este usuário.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT de acesso ausente, inválido ou expirado.',
  })
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
  @ApiOperation({
    summary: 'Excluir conta bancária',
    description:
      'Remove definitivamente uma conta bancária do usuário logado através do seu ID.',
  })
  @ApiParam({
    name: 'bankAccountId',
    description: 'ID UUID da conta bancária que será excluída.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({
    description:
      'Conta bancária excluída com sucesso. Não há conteúdo no corpo da resposta.',
  })
  @ApiNotFoundResponse({
    description:
      'A conta bancária informada não foi encontrada ou não pertence a este usuário.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT de acesso ausente, inválido ou expirado.',
  })
  async delete(
    @ActiveUserId() userId: string,
    @Param('bankAccountId') bankAccountId: string,
  ) {
    return this.deleteBankAccountService.execute({ userId, bankAccountId });
  }
}
