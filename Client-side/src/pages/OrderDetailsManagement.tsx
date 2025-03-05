import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Button, Dropdown, Table } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { BiPencil } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import AxiosInstance from '../confige/AxiosInstance';

interface Product {
  _id: string;
  id: string;
  name: string;
  unitPrice: number;
  qty: number;
  total: number;
}

interface Customer {
  _id: string;
  name?: string;
}

interface Orders {
  _id: string;
  products: Product[];
  total: number;
  status: string;
  Customer: Customer | string;
  Date: string;
}

const OrderDetailsManagement = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [page, setPage] = useState(1);
  const [size] = useState(8); 
  const storedUserString = localStorage.getItem('userData');
  const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
  const [userOrder,setUserOrder] = useState({});
  const findAllOrders = async () => {
    try {
      const response = await AxiosInstance.get(`/orders/orders-by-currentDay/${storedUser._id}?page=${page}&size=${size}`);
      setOrders(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }
  const getTotal = async() =>{
    try {
      const response = await AxiosInstance.get(`/orders/income-by-user-by-date/${storedUser._id}`);
      setUserOrder(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }
  // Function to update order status
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await AxiosInstance.put(`/orders/update-status/${orderId}`, {
        status: newStatus
      });
      
      if (response.status === 201) {
        // Update the local state to reflect the change
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        alert('Order status updated successfully');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  // Function to delete an order
  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await AxiosInstance.delete(`/orders/delete/${orderId}`);
        if (response.status === 200) {
          // Remove the deleted order from the state
          setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
          alert('Order deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      }
    }
  };
  useEffect(()=>{
    getTotal();
  },[]);
  useEffect(() => {
    findAllOrders();
  }, [page]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-start fw-bold my-3">Orders Management</h2>
      <Table striped bordered hover size="sm" className='my-2'>
        <thead>
          <tr className="fs-6 fw-medium">
            <th className="text-center">#</th>
            <th className="text-center">Product</th>
            <th className="text-center">Customer</th>
            <th className="text-center">Total</th>
            <th className="text-center">Status</th>
            <th className="text-center">Date</th>
            {/* <th className="text-center">Update</th> */}
            <th className="text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {orders?.length > 0 ? (
            orders.map((order, index) => (
              <tr key={index}>
                <td className="text-center">{order._id}</td>
                <td className="text-start">
                  {order.products.map((p) => (
                    <li key={p._id}> {p.name} - Qty: {p.qty}</li>
                  ))}
                </td>
                <td className="text-center">
                {typeof order.Customer === 'object' && order.Customer?._id 
                  ? order.Customer._id.toString()
                  : typeof order.Customer === 'string' ? order.Customer : ''}
                </td>
                <td className="text-center">{order.total}</td>
                <td className="text-center">
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id={`dropdown-${order._id}`}>
                      {order.status}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleStatusUpdate(order._id as string, "PENDING")}>
                        PENDING
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleStatusUpdate(order._id as string, "REJECTED")}>
                        REJECTED
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleStatusUpdate(order._id as string, "COMPLETED")}>
                        COMPLETED
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleStatusUpdate(order._id as string, "CANCELLED")}>
                        CANCELLED
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td className="text-center">{order.Date.substring(0, 10)}</td>
                {/* <td className="text-center">
                  <Button variant="secondary"><BiPencil/></Button>
                </td> */}
                <td className="text-center">
                  <Button 
                    variant="danger"
                    onClick={() => handleDeleteOrder(order._id as string)}
                  >
                    <RiDeleteBin6Line />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center">
                Loading Orders...
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="my-2">
        <Button className="me-2" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
        <Button onClick={() => setPage(page + 1)}>Next</Button>
      </div>
      {/* http://localhost:3000/api/v1/orders/income-by-user-by-date/ */}
      <h2 className='text-danger'>Today you Total Sales value: {userOrder?.income} </h2>
      <h3 className='primary'>Today you Total Orders: {userOrder?.orderCount} </h3>
    </motion.div>
  )
}

export default OrderDetailsManagement;