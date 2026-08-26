import { NotFoundException } from '@nestjs/common';

import { InMemoryUserRepository } from '@/test/repositories/in-memory-user.repository';

import { User } from '../entities/user.entity';

import { GetUserService } from './get-user.service';

let userRepo: InMemoryUserRepository;
let sut: GetUserService;

describe('GetUserService', () => {
  beforeEach(() => {
    userRepo = new InMemoryUserRepository();
    sut = new GetUserService(userRepo);
  });

  it('should get user profile', async () => {
    await userRepo.create(
      new User({
        id: 'valid-user-id',
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'strong123',
      }),
    );

    const output = await sut.execute('valid-user-id');

    expect(output.id).toEqual('valid-user-id');
    expect(output.name).toEqual('John Doe');
    expect(output.email).toEqual('john@mail.com');
  });

  it('should not return the user password', async () => {
    await userRepo.create(
      new User({
        id: 'valid-user-id',
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'strong123',
      }),
    );

    const output = await sut.execute('valid-user-id');

    expect(output).not.toHaveProperty('password');
  });

  it('should throw NotFoundException if user does not exist', async () => {
    await expect(sut.execute('invalid-user-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
