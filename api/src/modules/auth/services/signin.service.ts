import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '@/modules/users/repositories/user.repository';
import { HashProvider } from '@/shared/providers/hash/hash.provider';

import { SigninDto } from '../dtos/signin.dto';

type Output = {
  accessToken: string;
};

@Injectable()
export class SigninService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ email, password }: SigninDto): Promise<Output> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException();

    const passwordMatch = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatch) throw new UnauthorizedException();

    const accessToken = await this.jwtService.signAsync({ sub: user.id });

    return { accessToken };
  }
}
