import {useEffect, useState} from "react";
import axios from "axios";
import PageBadge from "../component/PageBadge/PageBadge.tsx";
import {Button, Form, Table} from "react-bootstrap";
import { motion } from 'framer-motion';
import ProductForm from "../Forms/ProductForm.tsx";
import { BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";

export interface Product{
    productName: string,
    quantity: number,
    description: string,
    sellingPrice: number,
    showPrice: number,
    buyPrice: number,
    expDate: string,
    activeState: boolean | undefined;
}
export type Products = Product & {_id:string};

const ProductManagement = ()=>{
   const [products, setProducts]=useState<Products[]>([]);
   const [searchText, setSearchText] = useState('');
   const [page, setPage] = useState(1);
   const [size] = useState(6); 
    const findAllProducts = async ()=> {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/products/find-all?searchText=${searchText}&page=${page}&size=${size}`);
            setProducts(response.data.data.dataList);
            console.log(response.data.data.dataList);
        }catch (error){
            console.log(error);
        }
    }
    // const createProduct = async (CustomerData:Products) => {
    //     try {
    //         const response = await axios.post('http://localhost:3000/api/v1/customers/create',CustomerData);
    //         console.log(response.data.data);
    //         findAllProducts();
    //     }catch (error){
    //         console.log(error);
    //     }
    // }
    const deleteProduct= async (id: string)=>{
        await axios.delete('http://localhost:3000/api/v1/products/delete/'+id);
        findAllProducts();
    }
    useEffect(()=>{
        findAllProducts();
    }, [searchText, page]);

  return (
    <motion.div
        initial={{ x: -100, y: -100, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2, duration: 1 }}
    >
        <PageBadge
            title='Product Management'
        />
        <ProductForm
            onSave={(ProductData)=>{console.log(ProductData);}}
        />
        <Form className="my-2">
           <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control type="text" placeholder="Search.."  onChange={(e) => setSearchText(e.target.value)} />
            </Form.Group>
        </Form>
        
        <Table striped bordered hover size="sm">
            <thead>
                <tr className="fs-6 fw-medium">
                    <th className="text-center">#</th>
                    <th className="text-center">Product Name</th>
                    <th className="text-center">Description</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-center">showPrice</th>
                    <th className="text-center">selling Price</th>
                    <th className="text-center">Buy Price</th>
                    <th className="text-center">exp Date</th>
                    <th className="text-center">Active State</th>
                    <th className="text-center">update</th>
                    <th className="text-center">Delete</th>
                </tr>
            </thead>
            <tbody className="fs-6 fw-light">
            {products?.length > 0 ? (
                products.map((u, index) => (
                    <tr key={index}>
                        <td className="text-center">{index+1}</td>
                        <td className="text-start">{u.productName}</td>
                        <td>{u.description}</td>
                        <td className="text-center">{u.quantity}</td>
                        <td className="text-center">{u.showPrice}</td>
                        <td className="text-center">{u.sellingPrice}</td>
                        <td className="text-center">{u.buyPrice}</td>
                        <td className="text-center">{u.expDate.substring(0, 10)}</td>
                        <td className="text-center">{u.activeState ? 'Active' : 'Inactive'}</td>
                        <td className="text-center"><Button variant="warning"><BiPencil/></Button></td>
                        <td className="text-center">
                            <Button variant="danger"
                                    onClick={()=>{
                                        if (confirm('are you sure?')){
                                            deleteProduct(u._id)
                                        }
                                    }}
                            >
                                <RiDeleteBin6Line />
                            </Button>
                        </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan={9} className="text-center">
                        Loading Products...
                    </td>
                </tr>
                )
                }
            </tbody>
            <div className="my-2 d-flex">
                <Button className="me-2" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
                <Button onClick={() => setPage(page + 1)}>Next</Button>
            </div>
        </Table>
    </motion.div>
  )
}
export default ProductManagement;