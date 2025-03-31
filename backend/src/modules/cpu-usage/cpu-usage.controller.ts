import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { CloudWatchService } from '../cloudwatch/cloudwatch.service';

@Controller('cpu-usage')
export class CpuUsageController {
  constructor(private readonly cloudWatchService: CloudWatchService) { }

  @Get()
  async getCpuUsage(
    @Query('ipAddress') ipAddress: string,
    @Query('timePeriod', ParseIntPipe) timePeriod: number,
    @Query('interval', ParseIntPipe) interval: number,
  ) {
    return await this.cloudWatchService.getMetricData(ipAddress, 'CPUUtilization', timePeriod, interval)
  }
}
