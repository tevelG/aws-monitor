import { Injectable } from '@nestjs/common';
import { CloudWatchService } from '../../shared/cloudwatch/cloudwatch.service';
import { GetCpuUsageDto } from './dto/get-cpu-usage.dto';

@Injectable()
export class CpuUsageService {
  constructor(private readonly cloudWatchService: CloudWatchService) { }

  async getCpuUsage(dto: GetCpuUsageDto) {
    return this.cloudWatchService.getMetricData(dto.ipAddress, 'CPUUtilization', dto.timePeriod, dto.interval);
  }
}
