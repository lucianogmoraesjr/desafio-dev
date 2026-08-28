import { Module } from '@nestjs/common';

import { BcryptProvider } from './hash/bcrypt.provider';
import { HashProvider } from './hash/hash.provider';

@Module({
  providers: [{ provide: HashProvider, useClass: BcryptProvider }],
  exports: [HashProvider],
})
export class ProvidersModule {}
