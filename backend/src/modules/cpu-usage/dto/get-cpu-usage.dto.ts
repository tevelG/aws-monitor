import { IsIP, IsNotEmpty, IsNumber } from 'class-validator';

export class GetCpuUsageDto {
  @IsIP()
  @IsNotEmpty()
  ipAddress: string;

  @IsNumber()
  @IsNotEmpty()
  timePeriod: number;

  @IsNumber()
  @IsNotEmpty()
  interval: number;
}
