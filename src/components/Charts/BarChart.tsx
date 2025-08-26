import { ApexOptions } from 'apexcharts';
import ApexChart from 'react-apexcharts';

interface BarChartProps {
  series: { name: string; data: number[] }[];
  categories: string[];
}
export default function BarChart({ series, categories }: BarChartProps) {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      fontFamily: 'Inter, sans-serif',
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    tooltip: {
      cssClass: 'text-black',
      fillSeriesColor: true,
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories,
    },
    yaxis: {
      show: true,
    },
  };

  return <ApexChart options={options} series={series} type="bar" width="100%" height={300} />;
}
