import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { TransactionType } from '@/modules/transactions/entities/transaction.entity';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Alimentação',
    description: 'Nome da categoria (limite de 50 caracteres)',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    enum: TransactionType,
    example: 'EXPENSE',
    description:
      'Tipo de transação a qual esta categoria pertence (INCOME para Receitas, EXPENSE para Despesas)',
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;
}
