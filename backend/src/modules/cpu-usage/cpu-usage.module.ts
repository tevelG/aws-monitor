import { Module } from '@nestjs/common';
import { CpuUsageService } from './cpu-usage.service';
import { CpuUsageController } from './cpu-usage.controller';
import { CloudWatchModule } from '../../shared/cloudwatch/cloudwatch.module';

@Module({
    imports: [CloudWatchModule],
    controllers: [CpuUsageController],
    providers: [CpuUsageService],
})

export class CpuUsageModule { }
