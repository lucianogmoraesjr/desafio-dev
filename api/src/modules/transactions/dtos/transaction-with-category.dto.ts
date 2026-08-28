import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { TransactionType } from '../entities/transaction.entity';

class TransactionCategoryDto {
  @ApiProperty({
    example: '987e6543-e21b-34d3-b654-426614174999',
    description: 'ID da categoria',
  })
  id: string;

  @ApiProperty({
    example: 'Alimentação',
    description: 'Nome da categoria',
  })
  name: string;
}

export class TransactionWithCategory {
  @ApiProperty({
    example: '321e9876-e89b-12d3-a456-426614174111',
    description: 'ID da transação',
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID da conta bancária associada',
  })
  bankAccountId: string;

  @ApiProperty({
    example: 'Compra no Mercado',
    description: 'Descrição da transação',
  })
  name: string;

  @ApiProperty({
    example: 15050,
    description: 'Valor em centavos',
  })
  valueInCents: number;

  @ApiProperty({
    example: '2026-08-28T12:00:00Z',
    description: 'Data da transação',
  })
  date: Date;

  @ApiProperty({
    enum: TransactionType,
    example: 'EXPENSE',
    description: 'Tipo da transação',
  })
  type: TransactionType;

  @ApiPropertyOptional({
    type: TransactionCategoryDto,
    description: 'Objeto da categoria caso a transação possua vínculo.',
  })
  category?: TransactionCategoryDto;
}
