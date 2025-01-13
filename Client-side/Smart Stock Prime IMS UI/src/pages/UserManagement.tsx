import {useEffect, useState} from "react";
import axios from "axios";
import PageBadge from "../component/PageBadge/PageBadge.tsx";
import {Button, Table} from "react-bootstrap";
import UserForm from "../Forms/UserForm.tsx";
import {motion} from "framer-motion";
import { UserUpdateModalForm } from "../Forms/UserUpdateModalForm.tsx";

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
            const response = await axios.get('http://localhost:3000/api/v1/users/find-all');
            setUser(response.data);
            console.log(response);
        }catch (error){
            console.log(error);
        }
    }
    const createUser = async (userData:user) => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/users/register',userData);
            console.log(response);
            findAllUsers();
        }catch (error){
            console.log(error);
        }
    }
    const deleteUser= async (id: string)=>{
        await axios.delete('http://localhost:3000/api/v1/users/delete/'+id);
        findAllUsers();
    }
    useEffect(()=>{
        findAllUsers();
    }, [])

    return (
        <motion.div
        initial={{ x: -100, y: -100, opacity: 0 }}
        animate={{ x: 0.2, y: 0.2, opacity: 1 }}
        transition={{ type: "spring", delay: 0.5, duration: 1 }}
        >
            <PageBadge
                title='User Management'
            />
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
                                <Button variant="secondary"
                                    onClick={
                                        () => {
                                            setUpdateUser(u);
                                            setModalShow(true);
                                        }}
                                >
                                    Update
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
                                    Delete
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