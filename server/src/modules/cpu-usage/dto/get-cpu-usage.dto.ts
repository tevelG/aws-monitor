import { Type } from 'class-transformer';
import { IsIP, IsPositive, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isMultipleOf60', async: false })
export class IsMultipleOf60Constraint implements ValidatorConstraintInterface {
  validate(value: number): boolean {
    return value % 60 === 0
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a multiple of 60`
  }
}

export class GetCpuUsageDto {
  @IsIP()
  ipAddress: string

  @Type(() => Number)
  @IsPositive()
  timePeriod: number

  @Type(() => Number)
  @IsPositive()
  @Validate(IsMultipleOf60Constraint)
  interval: number
}