import { fakerPT_BR as faker } from '@faker-js/faker';

import {
  Attributes,
  Transaction,
  TransactionType,
} from '@/modules/transactions/entities/transaction.entity';

export function makeTransaction(
  override: Partial<Attributes> = {},
): Transaction {
  return new Transaction({
    userId: faker.string.uuid({ version: 4 }),
    bankAccountId: faker.string.uuid({ version: 4 }),
    categoryId: faker.string.uuid({ version: 4 }),
    date: new Date(),
    name: faker.commerce.product(),
    type: faker.helpers.enumValue(TransactionType),
    valueInCents: faker.number.int({ min: 100, max: 499_900 }),
    ...override,
  });
}
