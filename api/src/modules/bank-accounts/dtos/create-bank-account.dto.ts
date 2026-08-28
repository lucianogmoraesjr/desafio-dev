import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { BankAccountType } from '../entities/bank-account.entity';

export class CreateBankAccountDto {
  @ApiProperty({
    example: 'NewBank',
    description: 'Nome de identificação da conta bancária',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 10500,
    description: 'Saldo inicial da conta registrado em centavos',
  })
  @IsNumber()
  @IsNotEmpty()
  initialBalanceInCents: number;

  @ApiProperty({
    enum: BankAccountType,
    example: 'CHECKING',
    description: 'Tipo da conta bancária',
  })
  @IsNotEmpty()
  @IsEnum(BankAccountType)
  type: BankAccountType;

  @ApiProperty({
    example: '#8A05BE',
    description: 'Cor em formato HEX associada à conta para exibição na UI',
  })
  @IsString()
  @IsNotEmpty()
  @IsHexColor()
  color: string;
}
