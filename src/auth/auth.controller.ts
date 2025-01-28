import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './auth.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 3, ttl: 1000 } })
  @Post('login')
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<AuthResponseDto> {
    return this.authService.signIn(email, password);
  }
}
