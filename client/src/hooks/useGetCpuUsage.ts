import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/axios";
import { MetricDataResult } from "@aws-sdk/client-cloudwatch";
import { IInputValues } from "../components/Layout";

const getCpuUsage = async ({ ipAddress, timePeriod, interval }: IInputValues): Promise<MetricDataResult> => {
    const response = await apiClient.post("/cpu-usage", { ipAddress, timePeriod, interval })
    return response.data
}

const useGetCpuUsage = ({ ipAddress, timePeriod, interval }: IInputValues) => {
    return useQuery<MetricDataResult>({
        queryKey: ['cpuUsage', { ipAddress, timePeriod, interval }],
        queryFn: () => getCpuUsage({ ipAddress, timePeriod, interval }),
        enabled: !!ipAddress && timePeriod > 0 && interval > 0,
        retry: false
    })
}

export default useGetCpuUsage