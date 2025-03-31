import { Module } from '@nestjs/common';
import { CloudWatchModule } from '../cloudwatch/cloudwatch.module';
import { CpuUsageController } from './cpu-usage.controller';

@Module({
    imports: [CloudWatchModule],
    controllers: [CpuUsageController],
    providers: [],
})

export class CpuUsageModule { }
