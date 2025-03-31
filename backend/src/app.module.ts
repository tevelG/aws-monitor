import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { CloudWatchService } from './modules/cloudwatch/cloudwatch.service';
import { CpuUsageController } from './modules/cpu-usage/cpu-usage.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  controllers: [CpuUsageController],
  providers: [CloudWatchService],
})

export class AppModule { }
