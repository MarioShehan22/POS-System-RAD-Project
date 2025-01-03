import {useEffect, useState} from "react";
import axios from "axios";
import PageBadge from "../component/PageBadge/PageBadge.tsx";
import {Button, Table} from "react-bootstrap";
import CustomerForm from "../Forms/CustomerForm.tsx";
import { motion } from 'framer-motion';

interface Customer{
    firstName:string;
    lastName:string;
    email:string;
    address:string;
    phoneNumber:string;
    activeState: boolean | undefined;
}
type  Customers = Customer & {_id:string};
const CustomerManagement = () => {
    const [customers, setCustomers]=useState<Customers[]>([]);
    const findAllCustomers = async ()=> {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/customers/find-all');
            setCustomers(response.data.data.dataList);
            console.log(response.data.data.dataList);
        }catch (error){
            console.log(error);
        }
    }
    const createCustomer = async (CustomerData:Customer) => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/customers/create',CustomerData);
            console.log(response.data.data);
            findAllCustomers();
        }catch (error){
            console.log(error);
        }
    }
    const deleteCustomer= async (id: string)=>{
        await axios.delete('http://localhost:3000/api/v1/customers/delete/'+id);
        findAllCustomers();
    }
    useEffect(()=>{
        findAllCustomers();
    }, [])

    return (
        <>
            <PageBadge
                title='Customer Management'
            />
            <CustomerForm
                onSave={(CustomerData)=>{createCustomer(CustomerData);}}
            />
            <Table striped bordered hover size="sm">
                <motion.thead
                    initial={{ x: -100, y: -100, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.2, duration: 1 }}
                >
                    <tr>
                        <th className="text-center">#</th>
                        <th className="text-center">First Name</th>
                        <th className="text-center">Last Name</th>
                        <th className="text-center">email</th>
                        <th className="text-center">Address</th>
                        <th className="text-center">Phone Number</th>
                        <th className="text-center">activeState</th>
                        <th className="text-center">update</th>
                        <th className="text-center">Delete</th>
                    </tr>
                </motion.thead>
                <motion.tbody
                    initial={{ x: -100, y: -100, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.2, duration: 1 }}
                >
                {customers?.length > 0 ? (
                    customers.map((u, index) => (
                        <tr key={index}>
                             <td className="text-center">{u._id}</td>
                             <td className="text-center">{u.firstName}</td>
                             <td className="text-center">{u.lastName}</td>
                             <td className="text-center">{u.email}</td>
                             <td className="text-center">{u.address}</td>
                             <td className="text-center">{u.phoneNumber}</td>
                             <td className="text-center">{u.activeState ? 'Active' : 'Inactive'}</td>
                             <td className="text-center"><Button variant="secondary">Update</Button></td>
                             <td className="text-center">
                                <Button variant="danger"
                                        onClick={()=>{
                                            if (confirm('are you sure?')){
                                                deleteCustomer(u._id)
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
                        <td colSpan={9} className="text-center">
                            Loading customers...
                        </td>
                    </tr>
                    )
                    }
                </motion.tbody>
            </Table>
        </>
    );
}
export default CustomerManagement;