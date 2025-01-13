import {useEffect, useState} from "react";
import axios from "axios";
import PageBadge from "../component/PageBadge/PageBadge.tsx";
import {Button, Table} from "react-bootstrap";
import { motion } from 'framer-motion';
import ProductForm from "../Forms/ProductForm.tsx";

interface Product{
    productName: string,
    quantity: number,
    description: string,
    sellingPrice: number,
    showPrice: number,
    expDate: string,
    activeState: boolean | undefined;
}
type Products = Product & {_id:string};

const ProductManagement = ()=>{
     const [products, setProducts]=useState<Products[]>([]);
    // const findAllProducts = async ()=> {
    //     try {
    //         const response = await axios.get('http://localhost:3000/api/v1/customers/find-all');
    //         setProducts(response.data.data.dataList);
    //         console.log(response.data.data.dataList);
    //     }catch (error){
    //         console.log(error);
    //     }
    // }
    // const createProduct = async (CustomerData:Products) => {
    //     try {
    //         const response = await axios.post('http://localhost:3000/api/v1/customers/create',CustomerData);
    //         console.log(response.data.data);
    //         findAllProducts();
    //     }catch (error){
    //         console.log(error);
    //     }
    // }
    // const deleteProduct= async (id: string)=>{
    //     await axios.delete('http://localhost:3000/api/v1/customers/delete/'+id);
    //     findAllProducts();
    // }
    // useEffect(()=>{
    //     findAllProducts();
    // }, []);

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
        <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    <th className="text-center">#</th>
                    <th className="text-center">Product Name</th>
                    <th className="text-center">Description</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-center">showPrice</th>
                    <th className="text-center">selling Price</th>
                    <th className="text-center">exp Date</th>
                    <th className="text-center">activeState</th>
                    <th className="text-center">update</th>
                    <th className="text-center">Delete</th>
                </tr>
            </thead>
            <tbody>
            {products?.length > 0 ? (
                products.map((u, index) => (
                    <tr key={index}>
                        <td className="text-center">{u._id}</td>
                        <td className="text-center">{u.productName}</td>
                        <td className="text-center">{u.description}</td>
                        <td className="text-center">{u.quantity}</td>
                        <td className="text-center">{u.showPrice}</td>
                        <td className="text-center">{u.sellingPrice}</td>
                        <td className="text-center">{u.expDate}</td>
                        <td className="text-center">{u.activeState ? 'Active' : 'Inactive'}</td>
                        <td className="text-center"><Button variant="secondary">Update</Button></td>
                        <td className="text-center">
                            <Button variant="danger"
                                    // onClick={()=>{
                                    //     if (confirm('are you sure?')){
                                    //         deleteProduct(u._id)
                                    //     }
                                    // }}
                            >
                                Delete
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
        </Table>
    </motion.div>
  )
}
export default ProductManagement;