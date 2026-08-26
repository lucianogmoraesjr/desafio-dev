import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class GetUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException();

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
