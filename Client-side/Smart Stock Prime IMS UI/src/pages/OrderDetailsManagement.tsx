import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Button, Table } from 'react-bootstrap';
interface Orders {
  _id:String;
  products:[
    _id:String,
    name: string,
    unitPrice: number,
    qty: number,
    total: number
  ];
  total:number | 0 ;
  status:string;
  Customer:string;
  Date:string;
}
const OrderDetailsManagement = () => {
  const [orders, setOrders]=useState<Orders[]>([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [size] = useState(8); 
  const findAllOrders = async ()=> {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/orders/find-all?page=${page}&size=${size}`);
      setOrders(response.data.data.dataList);
      console.log(response.data.data.dataList);
    }catch (error){
      console.log(error);
    }
  }
  useEffect(()=>{
    findAllOrders();
  },[[searchText, page]]);
  return (
    <div>
       <Table striped bordered hover size="sm" className='my-2'>
            <thead>
                <tr className="fs-6 fw-medium">
                    <th className="text-center">#</th>
                    <th className="text-center">Product</th>
                    <th className="text-center">Customer</th>
                    <th className="text-center">Total</th>
                    <th className="text-center">status</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">update</th>
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
                        <li key={p._id}> {p.name} </li>
                      ))}
                    </td>
                    <td className="text-center">{order.Customer._id ||order.Customer }</td>  {/* Assuming 'name' is the property for customer name */}
                    <td className="text-center">{order.total}</td>
                    <td className="text-center">{order.status}</td>
                    <td className="text-center">{order.Date}</td>
                    <td className="text-center"><Button variant="secondary">Update</Button></td>
                    <td className="text-center">
                      <Button variant="danger"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this order?')) {
                            // Call your delete function here, passing the order ID (order._id)
                          }
                        }}
                      >
                        Delete
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
            <div className="my-2 ">
                <Button className="me-2" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
                <Button onClick={() => setPage(page + 1)}>Next</Button>
            </div>
        </Table>
    </div>
  )
}
export default OrderDetailsManagement;