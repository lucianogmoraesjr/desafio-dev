import { Body, Controller, Post } from '@nestjs/common';

import { SignupService } from './services/signup.service';
import { SignupDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly signupService: SignupService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.signupService.execute(signupDto);
  }
}
