import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { CpuUsageService } from './cpu-usage.service';

@Controller('cpu-usage')
export class CpuUsageController {
  constructor(private readonly cpuUsageService: CpuUsageService) { }

  @Get()
  async getCpuUsage(
    @Query('ipAddress') ipAddress: string,
    @Query('timePeriod', ParseIntPipe) timePeriod: number,
    @Query('interval', ParseIntPipe) interval: number,
  ) {
    return this.cpuUsageService.getCpuUsage({ ipAddress, timePeriod, interval });
  }
}
