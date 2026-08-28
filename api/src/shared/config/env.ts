import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class Env {
  @IsString()
  @IsNotEmpty()
  databaseUrl!: string;

  @IsString()
  @IsNotEmpty()
  jwtSecret!: string;
}

export const env: Env = plainToInstance(
  Env,
  {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
  },
  {
    enableImplicitConversion: true,
  },
);

const errors = validateSync(env, {
  skipMissingProperties: false,
});

if (errors.length > 0) {
  throw new Error(errors.toString());
}
