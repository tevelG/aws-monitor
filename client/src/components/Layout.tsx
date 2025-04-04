import { useState } from "react"
import useGetCpuUsage from "../hooks/useGetCpuUsage"
import CpuUsageChart from "./CpuUsageChart"
import Form from "./Form"
import Header from "./Header"
import { OrbitProgress } from "react-loading-indicators"
import { AxiosError } from "axios"

export interface IInputValues {
    ipAddress: string
    timePeriod: number
    interval: number
}

const Layout = () => {
    const [inputValues, setInputValues] = useState<IInputValues | null>(null)

    const { data, error, isLoading } = useGetCpuUsage({
        ipAddress: inputValues?.ipAddress ?? "",
        timePeriod: inputValues?.timePeriod ?? 0,
        interval: inputValues?.interval ?? 0,
    })

    return (
        <div className="layout">
            <Header />
            <Form onSubmit={(values: IInputValues) => setInputValues(values)} />
            <main className="layout__main">
                {isLoading && <OrbitProgress size="medium" color="rgb(11, 58, 129)" />}
                {error && <p className="layout__main__error">
                    Error: {error instanceof AxiosError ? error.response?.data?.message : error.message}
                </p>}
                {data && <CpuUsageChart data={data} />}
            </main>
        </div>
    )
}

export default Layout