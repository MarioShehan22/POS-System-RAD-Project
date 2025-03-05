import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Container, Dropdown, Row } from 'react-bootstrap';
import { Product } from '../pages/ProductManagement';
import AxiosInstance from '../confige/AxiosInstance';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProductLifeCycle = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productName, setProductName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('P-2');
  const [items,setItems] = useState<Product[]>([]);
  useEffect(() => {
    // Fetch sales data whenever selected product changes
    getChartData();
  }, [selectedProduct]);

  useEffect(() => {
    // Fetch products when component mounts
    getProductdata();
  }, []);

  const getProductdata = async() =>{
    try {
        const response = await AxiosInstance.get(`/products/find-all`);
        setItems(response.data.data.dataList);
      } catch (e) {
        console.error('Error fetching data:', e);
        setError('Failed to fetch product data');
      }
  }
  const getChartData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(`/orders/product-sell-By-date/${selectedProduct}`);
      setSalesData(response.data);
      
      // If your API starts returning product name, you can set it here
      if (response.data.length > 0 && response.data[0].productName) {
        setProductName(response.data[0].productName);
      }
      
      setLoading(false);
    } catch (e) {
      console.error('Error fetching data:', e);
      setError('Failed to fetch product data');
      setLoading(false);
    }
  };

  // Extract dates and quantities from the salesData
  const dates = salesData.map(item => item.date);
  const quantities = salesData.map(item => item.quantitySold);

  const data = {
    labels: dates,
    datasets: [
      {
        label: productName ? `${productName} Sales` : 'Product Sales',
        data: quantities,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7
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
        text: 'Product Sales Over Time'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Sales: ${context.parsed.y} units`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity Sold'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  if (loading) return <div>Loading product data...</div>;
  if (error) return <div>{error}</div>;
  if (salesData.length === 0) return <div>No sales data available</div>;
  const handleClick=(e)=>{
    setSelectedProduct(e.target.value);
  }
  return (
    <Container>
      {salesData.length === 0 ? (
        <div className="alert alert-info">No sales data available for this product</div>
      ) : (
        <>
          <h4>Product Sales Trend</h4>
           <Row className="mb-4 d-flex justify-content-center align-items-center">
                <div className="col-md-4 d-flex">
                <label htmlFor="productSelect" className="form-label">Select Product:</label>
                <select 
                    id="productSelect" 
                    className="form-select" 
                    value={selectedProduct} 
                    onChange={handleClick}
                >
                    {items.map((product) => (
                    <option key={product.id} value={product.id}>
                        {product.productName}
                    </option>
                    ))}
                </select>
                </div>
            </Row>
          <Line options={options} data={data} />
          <div className="chart-info" style={{ marginTop: '20px' }}>
            <p>Total units sold: {quantities.reduce((sum, qty) => sum + qty, 0)}</p>
            <p>Average units per sale date: {(quantities.reduce((sum, qty) => sum + qty, 0) / quantities.length).toFixed(2)}</p>
            <p>Date range: {dates[0]} to {dates[dates.length - 1]}</p>
          </div>
        </>
      )}
    </Container>
  );
};

export default ProductLifeCycle;