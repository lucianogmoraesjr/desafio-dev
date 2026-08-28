import { NotFoundException } from '@nestjs/common';

import { makeUser } from '@/test/factories/make-user';
import { InMemoryUserRepository } from '@/test/repositories/in-memory-user.repository';

import { GetUserService } from './get-user.service';

let userRepo: InMemoryUserRepository;
let sut: GetUserService;

describe('GetUserService', () => {
  beforeEach(() => {
    userRepo = new InMemoryUserRepository();
    sut = new GetUserService(userRepo);
  });

  it('should get user profile', async () => {
    const user = makeUser({ name: 'John Doe', email: 'john@mail.com' });
    await userRepo.create(user);

    const output = await sut.execute(user.id);

    expect(output.id).toEqual(user.id);
    expect(output.name).toEqual('John Doe');
    expect(output.email).toEqual('john@mail.com');
  });

  it('should not return the user password', async () => {
    const user = makeUser({ name: 'John Doe', email: 'john@mail.com' });
    await userRepo.create(user);

    const output = await sut.execute(user.id);

    expect(output).not.toHaveProperty('password');
  });

  it('should throw NotFoundException if user does not exist', async () => {
    await expect(sut.execute('invalid-user-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
