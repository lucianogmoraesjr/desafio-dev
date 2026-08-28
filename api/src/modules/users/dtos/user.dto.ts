import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único do usuário (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nome completo do usuário',
  })
  name: string;

  @ApiProperty({
    example: 'john@email.com',
    description: 'Endereço de e-mail cadastrado pelo usuário',
  })
  email: string;

  @ApiProperty({
    example: '2026-08-28T12:00:00.000Z',
    description: 'Data e hora de criação da conta no banco de dados',
  })
  createdAt: Date;
}
