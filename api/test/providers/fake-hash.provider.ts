import { HashProvider } from '@/shared/providers/hash/hash.provider';

export class FakeHashProvider implements HashProvider {
  generateHash(payload: string): Promise<string> {
    return Promise.resolve(`${payload}-hashed`);
  }
  compareHash(payload: string, hashed: string): Promise<boolean> {
    return Promise.resolve(`${payload}-hashed` === hashed);
  }
}
