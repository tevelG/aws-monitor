import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface CpuData {
    Timestamps: string[]
    Values: number[]
}

const CpuUsageChart = ({ data }: { data: CpuData }) => {
    const timestamps = data.Timestamps.map((timestamp: string) => new Date(timestamp).toLocaleTimeString())
    const values = data.Values

    const chartData = {
        labels: timestamps,
        datasets: [
            {
                label: 'CPU Usage (%)',
                data: values,
            }
        ]
    }

    return <Line data={chartData} />
}

export default CpuUsageChart
