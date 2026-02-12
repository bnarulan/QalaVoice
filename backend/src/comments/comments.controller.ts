import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('comments')
export class CommentsController {
  constructor(private comments: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: { postId: number; content: string }, @Req() req: Request & { user: { userId: number } }) {
    return this.comments.create(body.postId, req.user.userId, body.content);
  }

  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.comments.findByPost(parseInt(postId));
  }
}
