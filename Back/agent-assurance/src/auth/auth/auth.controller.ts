
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    const agent = await this.authService.validateAgent(loginDto.login, loginDto.password);
    if (!agent) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return this.authService.login(agent);
  }
}