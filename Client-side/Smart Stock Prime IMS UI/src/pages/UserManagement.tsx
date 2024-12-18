import {useEffect, useState} from "react";
import axios from "axios";
import PageBadge from "../component/PageBadge/PageBadge.tsx";
import {Button, Table} from "react-bootstrap";
import UserForm from "../Forms/UserForm.tsx";

interface User{
    fullName:string,
    email:string,
    activeState: boolean|undefined,
}
type  Users = User & {_id:string};
type  user = User & {password:string,role:string};

const UserManagement = () => {
    const [user, setUser]=useState<Users[]>([]);
    // const [currentData,setCurrentData] = useState<User>({ activeState: undefined, email: "", fullName: ""})
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
        <>
            <PageBadge
                title='Customer Management'
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
                            <td className="text-center">{u.activeState}</td>
                            <td className="text-center"><Button variant="secondary">Update</Button></td>
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
        </>
    );
}
export default UserManagement;