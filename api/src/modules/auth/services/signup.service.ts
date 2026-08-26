import { ConflictException, Injectable } from '@nestjs/common';

import { HashProvider } from '../../../shared/providers/hash/hash.provider';
import { UserRepository } from '../../users/repositories/user.repository';
import { User } from '../../users/entities/user.entity';
import { SignupDto } from '../dtos/signup.dto';

type Output = {
  id: string;
};

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
