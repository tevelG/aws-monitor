import { Module } from '@nestjs/common';
import { CloudWatchModule } from './modules/cloudwatch/cloudwatch.module';
import { CpuUsageModule } from './modules/cpu-usage/cpu-usage.module';

@Module({
  imports: [CloudWatchModule, CpuUsageModule]
})

export class AppModule { }
