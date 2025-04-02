import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from "date-fns";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface CpuData {
    Timestamps: string[]
    Values: number[]
}

const formatDateTime = (timestamp: string) => {
    return format(parseISO(timestamp), "dd/MM HH:mm");
};

const CpuUsageChart = ({ data }: { data: CpuData }) => {
    const timestamps = data.Timestamps.map((timestamp: string) => formatDateTime(timestamp))
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
