import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  register(@Body() dto: RegisterDto, @Req() req: Request & { user: { userId: number } }) {
    return this.auth.register(dto.iin, dto.fullName, dto.password, req.user.userId, dto.role || 'RESIDENT', dto.sphere);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.iin, dto.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: Request & { user: { userId: number } }) {
    return this.auth.getProfile(req.user.userId);
  }
}
