import { Type } from 'class-transformer';
import { IsIP, IsPositive } from 'class-validator';

export class GetCpuUsageDto {
  @IsIP()
  ipAddress: string

  @Type(() => Number)
  @IsPositive()
  timePeriod: number

  @Type(() => Number)
  @IsPositive()
  interval: number
}
