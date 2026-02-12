import { Module } from '@nestjs/common';
import { EgovService } from './egov.service';

@Module({
  providers: [EgovService],
  exports: [EgovService],
})
export class EgovModule {}
