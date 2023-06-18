import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() data: AuthDto) {
    return this.authService.login(data);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/access-token')
  async getNewTokens(@Body() data: RefreshTokenDto) {
    return this.authService.getNewTokens(data);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldEmail = await this.authService.findByEmail(dto.email);
    const oldLogin = await this.authService.findByLogin(dto.login);
    if (oldEmail)
      throw new BadRequestException(
        'User with this email is already in the system',
      );

    if (oldLogin)
      throw new BadRequestException(
        'User with this login is already in the system',
      );

    return this.authService.register(dto);
  }
}
