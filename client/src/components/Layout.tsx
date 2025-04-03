import { useState } from "react"
import useGetCpuUsage from "../hooks/useGetCpuUsage"
import CpuUsageChart from "./CpuUsageChart"
import Form from "./Form"
import Header from "./Header"
import { OrbitProgress } from "react-loading-indicators"

export type FetchParams = { ipAddress: string, timePeriod: number, interval: number }

const Layout = () => {
    const [fetchParams, setFetchParams] = useState<FetchParams | null>(null)

    const { data, error, isLoading } = useGetCpuUsage(
        fetchParams?.ipAddress ?? "",
        fetchParams?.timePeriod ?? 0,
        fetchParams?.interval ?? 0
    )

    return (
        <div className="layout">
            <Header />
            <Form setFetchParams={setFetchParams} />
            <main className="layout__main">
                {isLoading && <OrbitProgress size="medium" color="rgb(11, 58, 129)" />}
                {error && <p>Error: {error.message}</p>}
                {data && <CpuUsageChart data={data} />}
            </main>
        </div>
    )
}

export default Layout