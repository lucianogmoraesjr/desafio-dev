import { User as PrismaUser } from '@/generated/prisma/client';

import { User } from '../../entities/user.entity';

export class PrismaUserMapper {
  static toEntity(raw: PrismaUser): User {
    return new User({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      password: raw.password,
      createdAt: raw.createdAt,
    });
  }

  static toPrisma(user: User): PrismaUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
    };
  }
}
