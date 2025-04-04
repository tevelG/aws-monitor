import { Module } from '@nestjs/common';
import { CpuUsageController } from './cpu-usage.controller';
import { CpuUsageService } from './cpu-usage.service';

@Module({
    controllers: [CpuUsageController],
    providers: [CpuUsageService]
})

export class CpuUsageModule { }