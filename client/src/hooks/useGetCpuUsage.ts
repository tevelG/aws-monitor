import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/axios";

const getCpuUsage = async (ipAddress: string, timePeriod: number, interval: number) => {
    const response = await apiClient.post("/cpu-usage", { ipAddress, timePeriod, interval })
    return response.data
}

const useGetCpuUsage = (ipAddress: string, timePeriod: number, interval: number) => {
    return useQuery({
        queryKey: ['cpuUsage', { ipAddress, timePeriod, interval }],
        queryFn: () => getCpuUsage(ipAddress, timePeriod, interval),
        enabled: !!ipAddress && timePeriod > 0 && interval > 0,
        retry: false
    })
}

export default useGetCpuUsage