import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString } from 'class-validator';

export class SigninResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description:
      'Token JWT que deve ser enviado no header Authorization (Bearer).',
  })
  @IsString()
  @IsJWT()
  accessToken: string;
}
