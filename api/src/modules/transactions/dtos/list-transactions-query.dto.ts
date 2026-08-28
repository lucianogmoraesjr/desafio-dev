import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsEnum, IsUUID, IsInt, Min, Max } from 'class-validator';

import { TransactionType } from '../entities/transaction.entity';

export class ListTransactionsQueryDto {
  @ApiProperty({ example: 'b5b2...' })
  @IsUUID()
  @IsOptional()
  bankAccountId?: string;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  @Max(11)
  month: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  year: number;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
