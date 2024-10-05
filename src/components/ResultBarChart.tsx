import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ResultBarChartProps {
  labels: string[];
  dataPoints: number[];
}

const ResultBarChart: React.FC<ResultBarChartProps> = ({ labels, dataPoints }) => {
  // Cores para as barras
  const colors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(199, 199, 199, 0.6)',
    'rgba(83, 102, 255, 0.6)',
    'rgba(50, 205, 50, 0.6)',
    'rgba(220, 20, 60, 0.6)',
  ];

  // Dados para o gráfico de barras
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Pontuação',
        data: dataPoints,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length).map(color => color.replace('0.6', '1')),
        borderWidth: 1,
      },
    ],
  };

  // Configurações do gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#fff',
        },
      },
      title: {
        display: true,
        text: 'Pontuações por Categoria',
        color: '#fff',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      y: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
  };

  return (
    <div style={{ width: '80%', height: '400px', marginTop: '20px' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default ResultBarChart;
