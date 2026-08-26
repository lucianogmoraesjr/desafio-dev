import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SignupService } from './services/signup.service';
import { DatabaseModule } from 'src/database/database.module';
import { ProvidersModule } from 'src/shared/providers/providers.module';

@Module({
  imports: [DatabaseModule, ProvidersModule],
  controllers: [AuthController],
  providers: [SignupService],
})
export class AuthModule {}
