import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { CategoriesController } from './categories.controller';
import { CreateCategoryService } from './services/create-category.service';
import { ListCategoriesService } from './services/list-categories.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [CreateCategoryService, ListCategoriesService],
})
export class CategoriesModule {}
