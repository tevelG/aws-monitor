import { Module } from '@nestjs/common';
import { CloudWatchService } from './modules/cloudwatch/cloudwatch.service';
import { CpuUsageController } from './modules/cpu-usage/cpu-usage.controller';

@Module({
  imports: [],
  controllers: [CpuUsageController],
  providers: [CloudWatchService],
})

export class AppModule { }
