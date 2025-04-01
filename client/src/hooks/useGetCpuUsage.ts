import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/axios";

const getCpuUsage = async (ipAddress: string, timePeriod: number, interval: number) => {
    if (!ipAddress || timePeriod <= 0 || interval <= 0) return null

    const response = await apiClient.post("/cpu-usage", { ipAddress, timePeriod, interval })
    return response.data
}

export default function useGetCpuUsage(ipAddress: string, timePeriod: number, interval: number) {
    return useQuery({
        queryKey: ['cpuUsage', { ipAddress, timePeriod, interval }],
        queryFn: () => getCpuUsage(ipAddress, timePeriod, interval),
        enabled: !!ipAddress && timePeriod > 0 && interval > 0
    });
}