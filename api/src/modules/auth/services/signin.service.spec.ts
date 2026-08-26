import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { makeUser } from '@/test/factories/make-user';
import { FakeHashProvider } from '@/test/providers/fake-hash.provider';
import { InMemoryUserRepository } from '@/test/repositories/in-memory-user.repository';

import { SigninService } from './signin.service';

let userRepo: InMemoryUserRepository;
let hashProvider: FakeHashProvider;
let jwtService: JwtService;
let sut: SigninService;

describe('SigninService', () => {
  beforeEach(() => {
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('fake-jwt-token'),
    } as unknown as JwtService;

    userRepo = new InMemoryUserRepository();
    hashProvider = new FakeHashProvider();
    sut = new SigninService(userRepo, hashProvider, jwtService);
  });

  it('should authenticate a user', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'john@mail.com',
      password: await hashProvider.generateHash('valid_password'),
    });

    await userRepo.create(user);

    const output = await sut.execute({
      email: 'john@mail.com',
      password: 'valid_password',
    });

    expect(output).toHaveProperty('accessToken');
    expect(output.accessToken).toBe('fake-jwt-token');
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.id });
  });

  it('should throw UnauthorizedException if user does not exist', async () => {
    await expect(
      sut.execute({
        email: 'john@mail.com',
        password: 'valid_password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    await userRepo.create(
      makeUser({
        name: 'John Doe',
        email: 'john@mail.com',
        password: await hashProvider.generateHash('valid_password'),
      }),
    );

    await expect(
      sut.execute({
        email: 'john@mail.com',
        password: 'wrong_password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
