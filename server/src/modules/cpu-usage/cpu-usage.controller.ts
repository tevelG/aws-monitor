import { Body, Controller, Post } from '@nestjs/common';
import { CpuUsageService } from './cpu-usage.service';
import { GetCpuUsageDto } from './dto/get-cpu-usage.dto';

@Controller('cpu-usage')
export class CpuUsageController {
  constructor(private readonly cpuUsageService: CpuUsageService) { }

  @Post()
  async getCpuUsage(@Body() { ipAddress, timePeriod, interval }: GetCpuUsageDto) {
    return await this.cpuUsageService.getMetricData(ipAddress, timePeriod, interval)
  }
}