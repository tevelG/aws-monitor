import { Controller, Get, Query } from '@nestjs/common';
import { CloudWatchService } from '../cloudwatch/cloudwatch.service';
import { GetCpuUsageDto } from './dto/get-cpu-usage.dto';

@Controller('cpu-usage')
export class CpuUsageController {
  constructor(private readonly cloudWatchService: CloudWatchService) { }

  @Get()
  async getCpuUsage(@Query() { ipAddress, timePeriod, interval }: GetCpuUsageDto) {
    return await this.cloudWatchService.getMetricData(ipAddress, 'CPUUtilization', timePeriod, interval)
  }
}
