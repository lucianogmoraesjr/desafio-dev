import { hash, compare } from 'bcrypt';

import { HashProvider } from './hash.provider';

export class BcryptProvider implements HashProvider {
  private ROUNDS = 10;

  async generateHash(payload: string): Promise<string> {
    return hash(payload, this.ROUNDS);
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
