import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('likes')
export class LikesController {
  constructor(private likes: LikesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  toggle(@Body() body: { postId: number }, @Req() req: Request & { user: { userId: number } }) {
    return this.likes.toggle(body.postId, req.user.userId);
  }
}
