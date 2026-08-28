import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Nome completo do usuário',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'john@mail.com',
    description: 'Endereço de e-mail válido que será utilizado para o login',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'strong123',
    minLength: 8,
    description:
      'Senha de acesso do usuário. Deve conter no mínimo 8 caracteres.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
