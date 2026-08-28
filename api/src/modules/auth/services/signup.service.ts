import { ConflictException, Injectable } from '@nestjs/common';

import { User } from '@/modules/users/entities/user.entity';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { HashProvider } from '@/shared/providers/hash/hash.provider';

import { SignupResponseDto } from '../dtos/signup-response.dto';
import { SignupDto } from '../dtos/signup.dto';

type Output = SignupResponseDto;

@Injectable()
export class SignupService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute({ name, email, password }: SignupDto): Promise<Output> {
    const emailExists = await this.userRepository.findByEmail(email);
    if (emailExists) throw new ConflictException('E-mail already exists.');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepository.create(user);

    return { id: user.id };
  }
}
