import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

import { User } from '../../entities/user.entity';
import { UserRepository } from '../user.repository';

import { PrismaUserMapper } from './prisma-user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return PrismaUserMapper.toEntity(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return PrismaUserMapper.toEntity(user);
  }

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });
  }
}
