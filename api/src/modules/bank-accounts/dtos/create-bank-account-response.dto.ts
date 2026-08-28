import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateBankAccountResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único da conta bancária recém-criada (UUID)',
  })
  @IsString()
  @IsUUID('4')
  id: string;
}
