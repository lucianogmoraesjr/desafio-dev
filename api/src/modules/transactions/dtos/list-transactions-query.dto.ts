import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsEnum, IsUUID, IsInt, Min, Max } from 'class-validator';

import { TransactionType } from '../entities/transaction.entity';

export class ListTransactionsQueryDto {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Filtra transações por uma conta bancária específica.',
  })
  @IsUUID()
  @IsOptional()
  bankAccountId?: string;

  @ApiProperty({
    example: 7,
    description: 'Mês de referência (0 = Janeiro, 11 = Dezembro)',
    minimum: 0,
    maximum: 11,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  @Max(11)
  month: number;

  @ApiProperty({
    example: 2026,
    description: 'Ano de referência',
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  year: number;

  @ApiPropertyOptional({
    enum: TransactionType,
    description: 'Filtra transações pelo tipo (INCOME ou EXPENSE).',
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
