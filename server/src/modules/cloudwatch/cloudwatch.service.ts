import { CloudWatchClient, GetMetricDataCommand, GetMetricDataInput, MetricDataResult } from '@aws-sdk/client-cloudwatch';
import { DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from 'src/common/constants';
import * as dotenv from 'dotenv'

dotenv.config()

@Injectable()
export class CloudWatchService {
    private cloudWatch: CloudWatchClient
    private ec2Client: EC2Client

    static readonly awsConfig = {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    }

    constructor() {
        this.cloudWatch = new CloudWatchClient(CloudWatchService.awsConfig)
        this.ec2Client = new EC2Client(CloudWatchService.awsConfig)
    }

    async getInstanceIdByIp(ipAddress: string): Promise<string> {
        const command = new DescribeInstancesCommand({
            Filters: [{ Name: 'private-ip-address', Values: [ipAddress] }],
        })

        const response = await this.ec2Client.send(command)
        const instances = response.Reservations?.flatMap((reservation) => reservation.Instances) || []

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
    }

    async getMetricData(ipAddress: string, metricName: string, timePeriod: number, interval: number): Promise<MetricDataResult[]> {
        const instanceId = await this.getInstanceIdByIp(ipAddress)

        const params: GetMetricDataInput = {
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
        try {
            const response = await this.cloudWatch.send(command)

            if (!response || !response.MetricDataResults) {
                throw new Error(`Unexpected response from CloudWatch: ${JSON.stringify(response)}`);
            }

            if (!response.MetricDataResults.length) {
                throw new NotFoundException(`No metric data found for instance: ${instanceId}`);
            }

            return response.MetricDataResults;
        } catch (error) {
            throw new Error(`Error fetching CloudWatch data: ${error.message}`);
        }
    }
}
