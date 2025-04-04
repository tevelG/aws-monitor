import { useState } from "react"
import useGetCpuUsage from "../hooks/useGetCpuUsage"
import CpuUsageChart from "./CpuUsageChart"
import Form, { IInputValues } from "./Form"
import Header from "./Header"
import { OrbitProgress } from "react-loading-indicators"
import { AxiosError } from "axios"

type FetchParams = { ipAddress: string, timePeriod: number, interval: number }

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
            <Form onSubmit={(values: IInputValues) => setFetchParams(values)} />
            <main className="layout__main">
                {isLoading && <OrbitProgress size="medium" color="rgb(11, 58, 129)" />}
                {error && <p>Error: {error instanceof AxiosError ? error.response?.data?.message : error.message}</p>}
                {data && <CpuUsageChart data={data} />}
            </main>
        </div>
    )
}

export default Layout