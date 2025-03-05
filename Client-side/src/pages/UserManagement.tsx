import {useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import UserForm from "../Forms/UserForm.tsx";
import {motion} from "framer-motion";
import { UserUpdateModalForm } from "../Forms/UserUpdateModalForm.tsx";
import { BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import AxiosInstance from "../confige/AxiosInstance.ts";

export interface User{
    fullName:string;
    email:string;
    activeState: boolean|undefined;
}
type  Users = User & {_id:string};
type  user = User & {password:string,role:string};
export type UpdateUser = {
    _id:string;
    fullName:string;
    email:string;
    activeState: boolean;
    password:string;
    role:string;
}
const UserManagement = () => {
    const [user, setUser]=useState<UpdateUser[]>([]);
    const [updateUser,setUpdateUser] = useState<UpdateUser>({ 
        _id:"",
        password: "",
        role: "",
        activeState: false, 
        email: "",
        fullName: ""
    });
    const [modalShow, setModalShow] = useState<boolean>(false);
    const findAllUsers = async ()=> {
        try {
            const response = await AxiosInstance.get('/users/find-all');
            setUser(response.data);
            console.log(response);
        }catch (error){
            console.log(error);
        }
    }
    const createUser = async (userData:user) => {
        try {
            const response = await AxiosInstance.post('/users/register',userData);
            console.log(response);
            findAllUsers();
        }catch (error){
            console.log(error);
        }
    }
    const deleteUser= async (id: string)=>{
        await AxiosInstance.delete('/users/delete/'+id);
        findAllUsers();
    }
    useEffect(()=>{
        findAllUsers();
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
        
        <h2 className="text-start fw-bold my-3">User Management</h2>
            <UserForm
                onSave={(userData)=>{createUser(userData);}}
            />
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th className="text-center">#</th>
                        <th className="text-center">Full Name</th>
                        <th className="text-center">email</th>
                        <th className="text-center">activeState</th>
                        <th className="text-center">update</th>
                        <th className="text-center">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {user.map((u, index)=>
                        <tr key={index}>
                            <td className="text-center">{u._id}</td>
                            <td className="text-center">{u.fullName}</td>
                            <td className="text-center">{u.email}</td>
                            <td className="text-center">{u.activeState ? 'Active' : 'Inactive'}</td>
                            <td className="text-center">
                                <Button variant="warning"
                                    onClick={
                                        () => {
                                            setUpdateUser(u);
                                            setModalShow(true);
                                        }}
                                >
                                    <BiPencil/>
                                </Button>
                            </td>
                            <td className="text-center">
                                <Button variant="danger"
                                        onClick={()=>{
                                            if (confirm('are you sure?')){
                                                deleteUser(u._id)
                                            }
                                        }}
                                >
                                    <RiDeleteBin6Line />
                                </Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {modalShow && <UserUpdateModalForm
              data={updateUser}
              show={modalShow}
              onHide={() => setModalShow(false)}
          />}
        </motion.div>
    );
}
export default UserManagement;