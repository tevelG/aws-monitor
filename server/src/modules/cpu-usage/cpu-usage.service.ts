import { CloudWatchClient, GetMetricDataCommand, GetMetricDataInput, MetricDataResult } from '@aws-sdk/client-cloudwatch';
import { DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from 'src/common/constants';

@Injectable()
export class CpuUsageService {
    private cloudWatch: CloudWatchClient
    private ec2Client: EC2Client

    constructor(private configService: ConfigService) {
        const awsConfig = {
            region: this.configService.get<string>('aws.region'),
            credentials: {
                accessKeyId: this.configService.get<string>('aws.accessKeyId'),
                secretAccessKey: this.configService.get<string>('aws.secretAccessKey')
            }
        }

        this.cloudWatch = new CloudWatchClient(awsConfig)
        this.ec2Client = new EC2Client(awsConfig)
    }

    async getInstanceIdByIp(ipAddress: string): Promise<string> {
        const command = new DescribeInstancesCommand({
            Filters: [{ Name: 'private-ip-address', Values: [ipAddress] }]
        })

        try {
            const response = await this.ec2Client.send(command)
            const instances = response?.Reservations?.flatMap((reservation) => reservation.Instances) || []

            if (!instances.length) {
                throw new NotFoundException(`No instance found for IP: ${ipAddress}`)
            }

            if (instances.length > 1) {
                throw new Error(`Multiple instances found for IP: ${ipAddress}`);
            }

            if (!instances[0].InstanceId) {
                throw new NotFoundException(`Instance found but missing InstanceId for IP: ${ipAddress}`)
            }

            return instances[0].InstanceId
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }

            throw new Error(`Something went wrong: ${error.message}`)
        }
    }

    async getMetricData(ipAddress: string, timePeriod: number, interval: number): Promise<MetricDataResult> {
        const instanceId = await this.getInstanceIdByIp(ipAddress)

        const params: GetMetricDataInput = {
            MetricDataQueries: [
                {
                    Id: 'metricData',
                    MetricStat: {
                        Metric: {
                            Namespace: 'AWS/EC2',
                            MetricName: 'CPUUtilization',
                            Dimensions: [{ Name: 'InstanceId', Value: instanceId }],
                        },
                        Period: interval,
                        Stat: 'Average'
                    },
                    ReturnData: true
                }
            ],
            StartTime: new Date(Date.now() - timePeriod * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND),
            EndTime: new Date()
        }

        const command = new GetMetricDataCommand(params)
        try {
            const response = await this.cloudWatch.send(command)

            if (!response || !response.MetricDataResults) {
                throw new Error(`Unexpected response from CloudWatch: ${JSON.stringify(response)}`)
            }

            if (!response.MetricDataResults.length) {
                throw new NotFoundException(`No metric data found for instance: ${instanceId}`)
            }

            return response.MetricDataResults[0]
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }

            throw new Error(`Something went wrong: ${error.message}`)
        }
    }
}