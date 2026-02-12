import { Controller, Get, Query } from '@nestjs/common';
import { ExecutorsService } from './executors.service';

@Controller('executors')
export class ExecutorsController {
  constructor(private executors: ExecutorsService) {}

  @Get()
  findAll() {
    return this.executors.findAll();
  }

  @Get('free')
  findFree(@Query('sphere') sphere: string) {
    return this.executors.findFreeBySphere(sphere || '');
  }
}
