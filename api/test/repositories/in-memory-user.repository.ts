import { User } from '../../src/modules/users/entities/user.entity';
import { UserRepository } from '../../src/modules/users/repositories/user.repository';

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = [];

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
