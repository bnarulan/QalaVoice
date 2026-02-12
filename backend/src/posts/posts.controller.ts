import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private posts: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreatePostDto, @Req() req: Request & { user: { userId: number } }) {
    return this.posts.create(
      req.user.userId,
      dto.content,
      dto.address,
      dto.lat,
      dto.lng,
      dto.type || 'COMPLAINT',
      dto.sphere || 'general',
    );
  }

  @Post(':id/photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.posts.addPhoto(parseInt(id), file);
  }

  @Post(':id/video')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }))
  uploadVideo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.posts.addVideo(parseInt(id), file);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.posts.findAll(parseInt(page || '1'), parseInt(limit || '20'));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posts.findOne(parseInt(id));
  }

  @Post(':id/accept')
  @UseGuards(JwtAuthGuard)
  accept(@Param('id') id: string, @Body() body: { deadline: string }, @Req() req: Request & { user: { userId: number } }) {
    return this.posts.acceptAndSetDeadline(parseInt(id), req.user.userId, new Date(body.deadline));
  }

  @Post(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.posts.updateStatus(parseInt(id), body.status);
  }
}
