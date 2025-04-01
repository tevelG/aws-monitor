import { useState } from "react"
import useGetCpuUsage from "../hooks/useGetCpuUsage"
import CpuUsageChart from "./CpuUsageChart"
import Form from "./Form"
import Header from "./Header"

export type FetchParams = { ipAddress: string, timePeriod: number, interval: number }

const Layout = () => {
    const [fetchParams, setFetchParams] = useState<FetchParams | null>(null)

    const { data, error, isLoading } = useGetCpuUsage(
        fetchParams?.ipAddress ?? "", 
        fetchParams?.timePeriod ?? 0, 
        fetchParams?.interval ?? 0
    )

    return (
        <div>
            <Header />
            <Form setFetchParams={setFetchParams} />
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && data[0] && <CpuUsageChart data={data[0]} />}
        </div>
    )
}

export default Layout