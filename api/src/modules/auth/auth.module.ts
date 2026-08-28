import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule } from '@/database/database.module';
import { env } from '@/shared/config/env';
import { ProvidersModule } from '@/shared/providers/providers.module';

import { AuthController } from './auth.controller';
import { SigninService } from './services/signin.service';
import { SignupService } from './services/signup.service';

@Module({
  imports: [
    DatabaseModule,
    ProvidersModule,
    JwtModule.register({
      global: true,
      secret: env.jwtSecret,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [SignupService, SigninService],
})
export class AuthModule {}
