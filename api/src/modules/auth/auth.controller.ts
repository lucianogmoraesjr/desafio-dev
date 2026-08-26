import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { Public } from '@/shared/decorators/public.decorator';

import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';
import { SigninService } from './services/signin.service';
import { SignupService } from './services/signup.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupService: SignupService,
    private readonly signinService: SigninService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.signupService.execute(signupDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    return this.signinService.execute(signinDto);
  }
}
