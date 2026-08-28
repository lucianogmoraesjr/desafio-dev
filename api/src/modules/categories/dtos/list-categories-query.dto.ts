import { IsOptional, IsEnum } from 'class-validator';

import { TransactionType } from '@/modules/transactions/entities/transaction.entity';

export class ListCategoriesQueryDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
