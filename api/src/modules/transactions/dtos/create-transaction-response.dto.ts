import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único da transação recém-criada (UUID)',
  })
  id: string;
}
