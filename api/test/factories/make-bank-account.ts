import { fakerPT_BR as faker } from '@faker-js/faker';

import {
  Attributes,
  BankAccount,
  BankAccountType,
} from '@/modules/bank-accounts/entities/bank-account.entity';

export function makeBankAccount(override: Partial<Attributes> = {}) {
  return new BankAccount({
    userId: faker.string.uuid({ version: 4 }),
    name: `${faker.company.name()} Bank`,
    type: faker.helpers.enumValue(BankAccountType),
    initialBalanceInCents: faker.number.int({ min: 100, max: 100_000 }),
    color: faker.color.rgb(),
    ...override,
  });
}
