import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { RatingModule } from './rating/rating.module';
import { AdminModule } from './admin/admin.module';
import { LikesModule } from './likes/likes.module';
import { ExecutorsModule } from './executors/executors.module';

@Module({
  imports: [
    AuthModule,
    PostsModule,
    CommentsModule,
    RatingModule,
    AdminModule,
    LikesModule,
    ExecutorsModule,
  ],
})
export class AppModule {}
