import { ConflictException } from '@nestjs/common';

import { makeUser } from '@/test/factories/make-user';
import { FakeHashProvider } from '@/test/providers/fake-hash.provider';
import { InMemoryUserRepository } from '@/test/repositories/in-memory-user.repository';

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

  it('should throw ConflictException if email already exist', async () => {
    await userRepo.create(makeUser({ email: 'john@mail.com' }));

    const user = {
      name: 'John Smith',
      email: 'john@mail.com',
      password: '123123123',
    };

    await expect(sut.execute(user)).rejects.toThrow(ConflictException);
  });
});
