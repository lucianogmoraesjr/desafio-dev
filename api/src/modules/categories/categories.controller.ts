import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ActiveUserId } from '@/shared/decorators/active-user-id.decorator';

import { CategoryDto } from './dtos/category.dto';
import { CreateCategoryResponseDto } from './dtos/create-category-response.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ListCategoriesQueryDto } from './dtos/list-categories-query.dto';
import { CreateCategoryService } from './services/create-category.service';
import { ListCategoriesService } from './services/list-categories.service';

@ApiTags('Categorias')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategoryService: CreateCategoryService,
    private readonly listCategoriesService: ListCategoriesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova categoria',
    description:
      'Cadastra uma nova categoria de transação financeira (ex: Alimentação, Transporte, Salário) para o usuário autenticado.',
  })
  @ApiCreatedResponse({
    description: 'Categoria criada com sucesso.',
    type: CreateCategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Falha de validação. Os dados enviados não respeitam o formato exigido (ex: nome excedendo 50 caracteres).',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT de acesso ausente, inválido ou expirado.',
  })
  async create(
    @ActiveUserId() userId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CreateCategoryResponseDto> {
    return this.createCategoryService.execute({ ...createCategoryDto, userId });
  }

  @Get()
  @ApiOperation({
    summary: 'Listar categorias',
    description:
      'Retorna uma lista com todas as categorias do usuário logado. Permite filtrar os resultados pelo tipo da categoria (INCOME ou EXPENSE).',
  })
  @ApiOkResponse({
    description: 'Listagem de categorias retornada com sucesso.',
    type: CategoryDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT de acesso ausente, inválido ou expirado.',
  })
  async findAll(
    @ActiveUserId() userId: string,
    @Query() query: ListCategoriesQueryDto,
  ): Promise<CategoryDto[]> {
    return this.listCategoriesService.execute(userId, query.type);
  }
}
