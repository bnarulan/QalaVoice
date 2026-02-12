import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('rating')
export class RatingController {
  constructor(private rating: RatingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  add(@Body() body: { score: number }, @Req() req: Request & { user: { userId: number } }) {
    return this.rating.add(req.user.userId, body.score);
  }

  @Get()
  getLeaderboard() {
    return this.rating.getLeaderboard();
  }
}
