import { ApexOptions } from 'apexcharts';
import ApexChart from 'react-apexcharts';

interface SteplineChartProps {
  categories: string[];
  series: { name: string; data: number[] }[];
}
export default function SteplineChart({ series, categories }: SteplineChartProps) {
  const options: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'stepline',
    },
    xaxis: {
      categories,
      labels: {
        show: false,
      },
    },
  };
  return <ApexChart options={options} series={series} type="line" width="100%" height={300} />;
}
