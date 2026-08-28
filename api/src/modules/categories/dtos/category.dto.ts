import { ApiProperty } from '@nestjs/swagger';

import { TransactionType } from '@/generated/prisma/enums';

export class CategoryDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único da categoria (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'Alimentação',
    description: 'Nome da categoria',
  })
  name: string;

  @ApiProperty({
    enum: TransactionType,
    example: 'EXPENSE',
    description: 'Tipo de transação vinculada a esta categoria',
  })
  type: TransactionType;

  @ApiProperty({
    example: '2026-08-28T12:00:00Z',
    description: 'Data de criação da categoria',
  })
  createdAt: Date;
}
