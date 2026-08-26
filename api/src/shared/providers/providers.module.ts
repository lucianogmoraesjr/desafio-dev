import { Module } from '@nestjs/common';
import { HashProvider } from './hash/hash.provider';
import { BcryptProvider } from './hash/bcrypt.provider';

@Module({
  providers: [{ provide: HashProvider, useClass: BcryptProvider }],
  exports: [HashProvider],
})
export class ProvidersModule {}
