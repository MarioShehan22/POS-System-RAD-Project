import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import AxiosInstance from '../confige/AxiosInstance';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TotalInventoryGraph = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChartData();
  }, []);

  const getChartData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get('/products/invetory-value');
      setData(response.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  // Extract product names and sell values from the data array
  const chartData = {
    labels: data.map(item => item.productName),
    datasets: [
      {
        label: 'Item Sell Value',
        data: data.map(item => item.AllItemSellValue),
        borderColor: 'rgb(0, 60, 255)',
        backgroundColor: 'rgb(115, 128, 223)',
        tension: 0.1
      },
      {
        label: 'Item Buy Value',
        data: data.map(item => item.AllItembuyValue),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Inventory Value Comparison',
        align: 'start',
        color: 'black',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: LKR ${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value (LKR)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Products'
        }
      }
    }
  };

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div className="bg-white rounded shadow-md">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default TotalInventoryGraph;