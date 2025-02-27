import {useEffect, useState} from "react";
import axios from "axios";
import PageBadge from "../component/PageBadge/PageBadge.tsx";
import {Button, Table} from "react-bootstrap";
import CustomerForm from "../Forms/CustomerForm.tsx";
import { motion } from 'framer-motion';
import CustomerUpdateModalForm from "../Forms/CustomerUpdateModalForm.tsx";
import { BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";

export interface Customer{
    firstName:string;
    lastName:string;
    email:string;
    address:string;
    phoneNumber:string;
    activeState: boolean | undefined;
}
export type  Customers = Customer & {_id:string};
const CustomerManagement = () => {
    const [customers, setCustomers]=useState<Customers[]>([]);
    const [updateCustomers, setUpdateCustomers]=useState<Customers>({
        _id:"",
        firstName:"",
        lastName:"",
        email:"",
        address:"",
        phoneNumber:"",
        activeState: false
    });
    const [modalShow, setModalShow] = useState<boolean>(false);
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
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="text-start fw-bold my-3">Customer Management</h2>
            <CustomerForm
                onSave={(CustomerData)=>{createCustomer(CustomerData);}}
            />
            <Table striped bordered hover size="sm" className="p-2 rounded opacity-75 shadow">
                <thead>
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
                </thead>
                <tbody>
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
                             <td className="text-center">
                                <Button variant="warning"
                                    onClick={
                                        () => {
                                            setUpdateCustomers(u);
                                            setModalShow(true);
                                        }}
                                >
                                    <BiPencil/>
                                </Button></td>
                             <td className="text-center">
                                <Button variant="danger"
                                        onClick={()=>{
                                            if (confirm('are you sure?')){
                                                deleteCustomer(u._id)
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
                            Loading customers...
                        </td>
                    </tr>
                    )
                    }
                </tbody>
            </Table>
            {modalShow && <CustomerUpdateModalForm
              data={updateCustomers}
              show={modalShow}
              onHide={() => setModalShow(false)}
          />}
        </motion.div>
    );
}
export default CustomerManagement;