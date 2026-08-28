import { ApiProperty } from '@nestjs/swagger';

import { BankAccountType } from '../entities/bank-account.entity';

export class BankAccountDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único da conta bancária (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'NewBank',
    description: 'Nome de identificação da conta bancária',
  })
  name: string;

  @ApiProperty({
    enum: BankAccountType,
    example: 'CHECKING',
    description: 'Tipo da conta bancária',
  })
  type: BankAccountType;

  @ApiProperty({
    example: '#8A05BE',
    description: 'Cor em formato HEX associada à conta',
  })
  color: string;

  @ApiProperty({
    example: '2026-08-28T12:00:00Z',
    description: 'Data de criação do registro no banco de dados',
  })
  createdAt: Date;

  @ApiProperty({
    example: 15000,
    description: 'Saldo atualizado da conta registrado em centavos',
  })
  currentBalanceInCents: number;
}
