import { ConflictException } from '@nestjs/common';

import { FakeHashProvider } from '../../../../test/providers/fake-hash.provider';
import { InMemoryUserRepository } from '../../../../test/repositories/in-memory-user.repository';
import { SignupService } from './signup.service';

let userRepo: InMemoryUserRepository;
let hashProvider: FakeHashProvider;
let sut: SignupService;

describe('SignupService', () => {
  beforeEach(() => {
    userRepo = new InMemoryUserRepository();
    hashProvider = new FakeHashProvider();
    sut = new SignupService(userRepo, hashProvider);
  });

  it('should create a new user', async () => {
    const output = await sut.execute({
      name: 'John Doe',
      email: 'john@mail.com',
      password: '123123123',
    });

    expect(output.id).toBeTruthy();
    expect(userRepo.users[0].email).toBe('john@mail.com');
  });

  it('should hash user password upon signup', async () => {
    const output = await sut.execute({
      name: 'John Doe',
      email: 'john@mail.com',
      password: '123123123',
    });

    const hashedPassword = await hashProvider.generateHash('123123123');

    expect(output.id).toBeTruthy();
    expect(userRepo.users[0].password).toBe(hashedPassword);
  });

  it('should not create a user with existing email', async () => {
    await userRepo.create({
      id: 'some-id',
      name: 'John Doe',
      email: 'john@mail.com',
      password: 'some-password',
      createdAt: new Date(),
    });

    const user = {
      name: 'John Smith',
      email: 'john@mail.com',
      password: '123123123',
    };

    void expect(sut.execute(user)).rejects.toThrow(ConflictException);
  });
});
