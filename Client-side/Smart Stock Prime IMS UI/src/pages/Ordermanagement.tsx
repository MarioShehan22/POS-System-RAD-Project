import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Products } from './ProductManagement';
import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap';
import "../pages/Style/productStyle.css";
import { Customers } from './CustomerManagement';

interface Cart{
  _id:string | '',
  name:string| '',
  unitPrice:number| 0,
  qty:number| 0,
  total:number| 0
}
const Ordermanagement = () => {
  const [products, setProducts]=useState<Products[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Cart[]>([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [size] = useState(6); 
  const [selectedCustomer,setSelectedCustomer] = useState<Customers>(Object);
  const [customers, setCustomers]=useState<Customers[]>([]);
  //const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  const findAllProducts = async ()=> {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/products/find-all?searchText=${searchText}&page=${page}&size=${size}`);
      setProducts(response.data.data.dataList);

    }catch (error){
      console.log(error);
    }
  }
  const findAllCustomers= async ()=>{
    const response = await axios.get('http://localhost:3000/api/v1/customers/find-all');
    setCustomers(response.data.data.dataList);
    console.log(response.data.data.dataList); 
  }
  const getCustomerById= async (id:string)=>{
    //setIsLoadingCustomer(true);
    const response = await axios.get('http://localhost:3000/api/v1/customers/find-by-id/' + id);
    setSelectedCustomer(response.data.data);
    //setIsLoadingCustomer(false);
    console.log(response.data.data);
  }
  const addToCart = (newItem: Cart) => {
    // Check if the item already exists in the cart
    const existingItem = selectedProducts.find((item) => item._id === newItem._id);
    getTotal();
    if (existingItem) {
      // Update quantity and total for existing item
      setSelectedProducts((prevState) =>
        prevState.map((item) =>
          item._id === newItem._id
            ? { ...item, qty: item.qty + newItem.qty, total: item.unitPrice * (item.qty + newItem.qty) }
            : item
        )
      );
    } else {
      // Add new item to the cart
      setSelectedProducts((prevState) => [...prevState, newItem]);
    }
    console.log(selectedProducts);
  };
  const getTotal = () => {
      let netTotal = selectedProducts.reduce((total, products) => total + products.unitPrice * products.qty, 0).toFixed(4);
      console.log(netTotal);
      return netTotal;
  }
  const handleQuantityChange = (itemId: string, newQty: number) => {
    if (newQty < 0) {
      console.warn('Quantity cannot be negative');
      return;
    }

    setSelectedProducts(
      (prevState) =>prevState.map((item) => (item._id === itemId ? { ...item, qty: newQty, total: item.unitPrice * newQty } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setSelectedProducts((prevState) => prevState.filter((item) => item._id !== itemId));
  };
  useEffect(()=>{
    findAllProducts();
  }, [searchText,page]);
  useEffect(()=>{
    findAllCustomers();
  },[]);
  return (
    <Container>
      <Row className='my-2 p-2'>
          <select id="customer" className='form-control w-25'onChange={(e)=>{getCustomerById(e.target.value)}}>
            <option value="">Select Customer</option>
            {customers.length > 0 && (
              <>
                {customers.map((customer, index) => (
                  <option key={index} value={customer._id}>{customer.firstName}</option>
                ))}
              </>
            )}
          </select>
        </Row>
      <Row xs={1} md={2} className="mb-4 main-container">
        {products.map((product, index) => (
          <Card key={product._id || index} className='card-style'>
            <Card.Body>
              <Card.Title className='text-capitalize'>{product.productName}</Card.Title>
              <Card.Title>Rs {product.showPrice}</Card.Title>
              <Card.Text>
                {product.quantity}
              </Card.Text>
              <Card.Text>
                Expire Date {product.expDate}
              </Card.Text>
              <div>
                <Button variant="primary" size="sm" 
                onClick={() => 
                  addToCart({
                    _id: product._id,
                    name: product.productName,
                    unitPrice: product.sellingPrice,
                    qty: 1, // Default quantity to 1
                    total: product.sellingPrice,
                }) 
              }
                  
                >
                  Add to Cart
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </Row>
      <Row className='d-flex justify-content-center'>
        <Button className='w-25 me-2' onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
        <Button className='w-25 ' onClick={() => setPage(page + 1)}>Next</Button>
      </Row>
      
      <h2>Cart Items</h2>
      {selectedProducts.length > 0 ? (
        <Table striped bordered hover size="sm">
        <thead>
          <tr className="fs-6 fw-medium">
            <th className="text-center">#</th>
            <th className="text-center">Product Name</th>
            <th className="text-center">Quantity</th>
            <th className="text-center">Unit Price</th>
            <th className="text-center">Total Price</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((item) => (
            <tr key={item._id}>
              <td className="text-center">{item._id}</td>
              <td className="text-center">{item.name}</td>
              <td className="text-center">
                {item.qty}
                <Button variant="secondary" size="sm" style={{ marginLeft: 10 }} onClick={() => handleQuantityChange(item._id, item.qty - 1)}>
                  -
                </Button>
                <Button variant="secondary" size="sm" style={{ marginLeft: 10 }} onClick={() => handleQuantityChange(item._id, item.qty + 1)}>
                  +
                </Button>
              </td>
              <td className="text-center">Rs {(item.unitPrice).toFixed(2)}</td> 
              <td className="text-center">Rs {(item.total).toFixed(2)}</td> 
              <td className="text-center">
                <Button variant="danger" size="sm" style={{ marginLeft: 10 }} onClick={() => removeFromCart(item._id)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      ) : (
        <p>No items in the cart.</p>
      )}
      <h2 className='text-danger'>Total : {getTotal()} </h2>
        <button className='my-2 btn btn-secondary' 
        onClick={async ()=>{
            await axios.post('http://localhost:3000/api/v1/orders/create',{
              Customer:selectedCustomer,
              status:"PENDING",
              total:getTotal(),
              products: selectedProducts
              });
              setSelectedProducts([]);
              //selectedCustomer(Object);
        }}>
          Place Order
        </button>
    </Container>
  )
}
export default Ordermanagement;