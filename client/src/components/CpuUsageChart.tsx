import { MetricDataResult } from '@aws-sdk/client-cloudwatch';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { format } from "date-fns";
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const formatDateTime = (timestamp: Date) => {
    return format(timestamp, "dd/MM HH:mm")
}

interface ICpuUsageChart {
    data: MetricDataResult
}

const CpuUsageChart = ({ data }: ICpuUsageChart) => {
    const timestamps = data?.Timestamps?.map((timestamp) => formatDateTime(timestamp))
    const values = data?.Values?.map(value => value * 100)

    const chartData = {
        labels: timestamps,
        datasets: [
            {
                label: 'CPU Usage Over Time (%)',
                data: values,
                borderColor: "rgb(11, 127, 148)",
                backgroundColor: "rgb(11, 127, 148)",
                pointRadius: 3
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 30 } },
        scales: {
            x: {
                ticks: { font: { size: 11 }, maxTicksLimit: 20 },
                reverse: true
            },
            y: {
                beginAtZero: true,
                ticks: { font: { size: 11 } }
            }
        }
    }

    return <Line data={chartData} options={options} />
}

export default CpuUsageChart
