import { Injectable, NotFoundException } from '@nestjs/common';

import { UserDto } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';

type Output = UserDto;

@Injectable()
export class GetUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<Output> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException();

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
