import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'b5b2...' })
  @IsUUID()
  @IsNotEmpty()
  bankAccountId: string;

  @ApiProperty({ example: 'c8d4...', required: false })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ example: 'Compra no Mercado' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 15050, description: 'Value in cents' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  valueInCents: number;

  @ApiProperty({ example: '2026-08-26T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;
}
