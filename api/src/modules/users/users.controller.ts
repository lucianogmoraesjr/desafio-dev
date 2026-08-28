import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ActiveUserId } from '@/shared/decorators/active-user-id.decorator';

import { UserDto } from './dtos/user.dto';
import { GetUserService } from './services/get-user.service';

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly getUserService: GetUserService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Obter perfil do usuário',
    description:
      'Retorna as informações de perfil do usuário atualmente autenticado com base no token JWT.',
  })
  @ApiOkResponse({
    description: 'Dados do usuário retornados com sucesso.',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT de acesso ausente, inválido ou expirado.',
  })
  async me(@ActiveUserId() userId: string): Promise<UserDto> {
    return this.getUserService.execute(userId);
  }
}
