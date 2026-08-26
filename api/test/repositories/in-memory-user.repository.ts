import { User } from '@/modules/users/entities/user.entity';
import { UserRepository } from '@/modules/users/repositories/user.repository';

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = [];

  findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return Promise.resolve(null);
    return Promise.resolve(user);
  }

  findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    if (!user) return Promise.resolve(null);
    return Promise.resolve(user);
  }

  create(user: User): Promise<void> {
    this.users.push(user);
    return Promise.resolve();
  }
}
