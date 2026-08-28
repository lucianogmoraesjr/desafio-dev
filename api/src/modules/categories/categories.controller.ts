import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ActiveUserId } from '@/shared/decorators/active-user-id.decorator';

import { CreateCategoryDto } from './dtos/create-category.dto';
import { ListCategoriesQueryDto } from './dtos/list-categories-query.dto';
import { CreateCategoryService } from './services/create-category.service';
import { ListCategoriesService } from './services/list-categories.service';

@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategoryService: CreateCategoryService,
    private readonly listCategoriesService: ListCategoriesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @ActiveUserId() userId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.createCategoryService.execute({ ...createCategoryDto, userId });
  }

  @Get()
  async findAll(
    @ActiveUserId() userId: string,
    @Query() query: ListCategoriesQueryDto,
  ) {
    return this.listCategoriesService.execute(userId, query.type);
  }
}
