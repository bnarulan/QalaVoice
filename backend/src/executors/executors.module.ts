import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ExecutorsService } from './executors.service';
import { ExecutorsController } from './executors.controller';

@Module({
  imports: [PrismaModule],
  providers: [ExecutorsService],
  controllers: [ExecutorsController],
})
export class ExecutorsModule {}
