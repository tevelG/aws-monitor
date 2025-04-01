import { Type } from 'class-transformer';
import { IsIP, IsPositive, Validate } from 'class-validator';

function IsMultipleOf60(value: number) {
  return value % 60 === 0
}

export class GetCpuUsageDto {
  @IsIP()
  ipAddress: string

  @Type(() => Number)
  @IsPositive()
  timePeriod: number

  @Type(() => Number)
  @Validate(IsMultipleOf60, { message: 'Interval must be a multiple of 60' })
  @IsPositive()
  interval: number
}
