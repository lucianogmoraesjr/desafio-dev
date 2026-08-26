import { fakerPT_BR as faker } from '@faker-js/faker';

import {
  Attributes,
  Category,
} from '@/modules/categories/entities/category.entity';

const categories = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Contas de Consumo',
];

export function makeCategory(override: Partial<Attributes> = {}) {
  return new Category({
    name: faker.helpers.arrayElement(categories),
    userId: faker.string.uuid({ version: 4 }),
    ...override,
  });
}
