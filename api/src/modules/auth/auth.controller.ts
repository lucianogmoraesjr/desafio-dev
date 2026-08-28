import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Public } from '@/shared/decorators/public.decorator';

import { SigninResponseDto } from './dtos/signin-response.dto';
import { SigninDto } from './dtos/signin.dto';
import { SignupResponseDto } from './dtos/signup-response.dto';
import { SignupDto } from './dtos/signup.dto';
import { SigninService } from './services/signin.service';
import { SignupService } from './services/signup.service';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupService: SignupService,
    private readonly signinService: SigninService,
  ) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastrar nova conta',
    description:
      'Cria um novo usuário na plataforma utilizando nome, e-mail e senha.',
  })
  @ApiCreatedResponse({
    description: 'Conta de usuário criada com sucesso.',
    type: SignupResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Falha de validação. Os dados enviados não respeitam o formato exigido (ex: e-mail inválido ou senha muito curta).',
  })
  @ApiConflictResponse({
    description: 'Conflito. O e-mail informado já está em uso por outra conta.',
  })
  async signup(@Body() signupDto: SignupDto): Promise<SignupResponseDto> {
    return this.signupService.execute(signupDto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuário',
    description:
      'Valida as credenciais do usuário e retorna um token JWT de acesso para comunicação com as rotas privadas da API.',
  })
  @ApiOkResponse({
    description: 'Autenticação bem-sucedida.',
    type: SigninResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas. E-mail ou senha incorretos.',
  })
  @ApiBadRequestResponse({
    description: 'Falha de validação. O corpo da requisição está malformado.',
  })
  async signin(@Body() signinDto: SigninDto): Promise<SigninResponseDto> {
    return this.signinService.execute(signinDto);
  }
}
