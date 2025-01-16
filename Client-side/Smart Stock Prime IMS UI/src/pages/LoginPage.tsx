import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    password: z.string().min(8, "Password is required"),
});

export type UserFormData = z.infer<typeof formSchema>;

// type Props = {

// }
const LoginPage = () => {
    const {
            control, // Use control instead of register for improved type safety
            handleSubmit,
            formState: { errors },
            reset,
        } = useForm<UserFormData>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                email: "",
                password: "",
            },
        }
    );
    const navigate = useNavigate();
    const onSubmit = handleSubmit( async (date) => {
        //event.preventDefault(); // Prevent default form submission behavior
        //http://localhost:3000/api/v1/users/login
        console.log(date);
        // Your form submission logic here
        try{
            const response = await axios.post('http://localhost:3000/api/v1/users/log-in',date);
            if(response.status==200){
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate()+2);
                const cookieValue=encodeURIComponent('token')+'=' +encodeURIComponent(response.data)+'; expires='+expirationDate.toUTCString()+'; path=/';
                document.cookie=cookieValue;
                navigate('/');
            }
            reset();
        }catch (e){
            console.log(e);
        }
    });
  return (
    <Container>
        <Row style={{ height: "100vh" }} className='d-flex flex-column align-items-center justify-content-center'>
        <h2 className='fw-semibold text-center mb-4 text-primary lh-base'>Smart Stock Prime<br/> Inventory Management System</h2>
            <Form className='w-25 mx-auto text-center' onSubmit={onSubmit}>
            <h3 className='fw-semibold'>Login</h3>
                <Col className='w-100'>
                    <Form.Group className="py-1">
                        <FloatingLabel
                            controlId="floatingTextarea"
                            label="email"
                            className="mb-2"
                        >
                        <Controller
                            control={control}
                            name="email"
                            render={({field}) => (
                                <Form.Control isInvalid={!!errors.email} {...field} type="email" placeholder="Enter email"/>
                            )}
                        />
                        </FloatingLabel>
                    </Form.Group>
                </Col>
                <Col className='w-100'>
                    <Form.Group className="py-1">
                        <FloatingLabel
                            controlId="floatingTextarea"
                            label="password"
                            className="mb-2"
                        >
                        <Controller
                            control={control}
                            name="password"
                            render={({field}) => (
                                <Form.Control  isInvalid={!!errors.password} {...field} type="password" placeholder="Enter password"/>
                            )}
                        />
                        </FloatingLabel>
                    </Form.Group>
                </Col>
                <Col className="w-100 d-flex align-items-center">
                    <Button type="submit" className="p-2 w-100 border text-decoration-none text-white bg-secondary rounded-3">
                        Login
                    </Button>
                </Col>
            </Form>
        </Row>
    </Container>
  )
}

export default LoginPage