import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    example: 'john@mail.com',
    description: 'Endereço de e-mail cadastrado pelo usuário',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'strong123',
    minLength: 8,
    description: 'Senha de acesso correspondente ao e-mail informado',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
