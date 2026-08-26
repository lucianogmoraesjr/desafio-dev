import { fakerPT_BR as faker } from '@faker-js/faker';

import { Attributes, User } from '@/modules/users/entities/user.entity';

export function makeUser(override: Partial<Attributes> = {}) {
  return new User({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    ...override,
  });
}
