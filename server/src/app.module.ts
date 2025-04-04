import { Module } from '@nestjs/common';
import { CpuUsageModule } from './modules/cpu-usage/cpu-usage.module';
import config from './config/aws-config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CpuUsageModule,
    ConfigModule.forRoot({ load: [config], isGlobal: true })
  ]
})

export class AppModule { }