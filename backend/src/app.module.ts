import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CpuUsageController } from './modules/cpu-usage/cpu-usage.controller';
import { CpuUsageService } from './modules/cpu-usage/cpu-usage.service';
import { CloudWatchService } from './shared/cloudwatch/cloudwatch.service';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  controllers: [AppController, CpuUsageController],
  providers: [AppService, CpuUsageService, CloudWatchService],
})
export class AppModule {}
