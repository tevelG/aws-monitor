import { CloudWatchClient, GetMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import { DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudWatchService {
    private cloudWatch: CloudWatchClient;
    private ec2Client: EC2Client;

    constructor(private configService: ConfigService) {
        const awsConfig = {
            region: this.configService.get('aws.region'),
            credentials: {
                accessKeyId: this.configService.get('aws.accessKeyId'),
                secretAccessKey: this.configService.get('aws.secretAccessKey'),
            },
        };

        this.cloudWatch = new CloudWatchClient(awsConfig);
        this.ec2Client = new EC2Client(awsConfig);
    }

    async getInstanceIdByIp(ipAddress: string): Promise<string> {
        const command = new DescribeInstancesCommand({
            Filters: [{ Name: 'private-ip-address', Values: [ipAddress] }],
        });

        const response = await this.ec2Client.send(command);
        const instances = response.Reservations?.flatMap((r) => r.Instances) || [];

        if (!instances.length) {
            throw new NotFoundException(`No EC2 instance found for IP: ${ipAddress}`);
        }
        console.log(instances)

        return instances[0].InstanceId!;
    }

    async getMetricData(ipAddress: string, metricName: string, timePeriod: number, interval: number) {
        const instanceId = await this.getInstanceIdByIp(ipAddress);

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
            StartTime: new Date(Date.now() - timePeriod * 60 * 1000),
            EndTime: new Date(),
        };

        try {
            const command = new GetMetricDataCommand(params);
            const response = await this.cloudWatch.send(command);

            if (!response.MetricDataResults?.length) {
                throw new NotFoundException(`No metric data found for instance: ${instanceId}`);
            }

            return response.MetricDataResults;
        } catch (error) {
            throw new Error(`Error fetching CloudWatch data: ${error.message}`);
        }
    }
}
