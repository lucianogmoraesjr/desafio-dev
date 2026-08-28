import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID da conta bancária à qual a transação pertence',
  })
  @IsUUID()
  @IsNotEmpty()
  bankAccountId: string;

  @ApiPropertyOptional({
    example: '987e6543-e21b-34d3-b654-426614174999',
    description: 'ID da categoria da transação (opcional)',
  })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    example: 'Compra no Mercado',
    description: 'Título/Descrição da transação',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 15050,
    description:
      'Valor monetário da transação registrado em centavos (R$ 150,50)',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  valueInCents: number;

  @ApiProperty({
    example: '2026-08-28T00:00:00.000Z',
    description: 'Data de efetivação da transação no formato ISO 8601',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    enum: TransactionType,
    example: 'EXPENSE',
    description: 'Tipo da transação (Entrada ou Saída)',
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;
}
