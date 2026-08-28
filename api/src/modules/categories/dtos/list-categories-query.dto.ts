import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

import { TransactionType } from '@/modules/transactions/entities/transaction.entity';

export class ListCategoriesQueryDto {
  @ApiProperty({
    enum: TransactionType,
    required: false,
    description:
      'Filtra as categorias por tipo. Se não for informado, retorna todas as categorias do usuário.',
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
