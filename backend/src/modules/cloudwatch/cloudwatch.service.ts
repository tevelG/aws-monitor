import { CloudWatchClient, GetMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import { DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from 'src/common/constants';

@Injectable()
export class CloudWatchService {
    private cloudWatch: CloudWatchClient
    private ec2Client: EC2Client

    constructor(private configService: ConfigService) {
        const awsConfig = {
            region: this.configService.get('aws.region'),
            credentials: {
                accessKeyId: this.configService.get('aws.accessKeyId'),
                secretAccessKey: this.configService.get('aws.secretAccessKey'),
            },
        }

        this.cloudWatch = new CloudWatchClient(awsConfig)
        this.ec2Client = new EC2Client(awsConfig)
    }

    async getInstanceIdByIp(ipAddress: string): Promise<string> {
        const command = new DescribeInstancesCommand({
            Filters: [{ Name: 'private-ip-address', Values: [ipAddress] }],
        })

        const response = await this.ec2Client.send(command)
        const instances = response.Reservations?.flatMap((r) => r.Instances) || []

        if (!instances.length) {
            throw new NotFoundException(`No instance found for IP: ${ipAddress}`)
        }

        if (!instances[0].InstanceId) {
            throw new NotFoundException(`Instance found but missing InstanceId for IP: ${ipAddress}`)
        }

        return instances[0].InstanceId
    }

    async getMetricData(ipAddress: string, metricName: string, timePeriod: number, interval: number) {
        const instanceId = await this.getInstanceIdByIp(ipAddress)

        const params = {
            MetricDataQueries: [
                {
                    Id: 'metricData',
                    MetricStat: {
                        Metric: {
                            Namespace: 'AWS/EC2',
                            MetricName: metricName,
                            Dimensions: [{ Name: 'InstanceId', Value: instanceId }],
                        },
                        Period: interval,
                        Stat: 'Average',
                    },
                    ReturnData: true,
                },
            ],
            StartTime: new Date(Date.now() - timePeriod * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND),
            EndTime: new Date(),
        }

        const command = new GetMetricDataCommand(params)
        const { MetricDataResults } = await this.cloudWatch.send(command)

        if (!MetricDataResults.length) {
            throw new NotFoundException(`No metric data found for instance: ${instanceId}`)
        }

        return MetricDataResults
    }
}
