import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from "axios";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const formSchema = z.object({
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    password: z.string().min(8, "Password is required"),
});

export type UserFormData = z.infer<typeof formSchema>;

const LoginPage = () => {
    const {
            control, // Use control instead of register for improved type safety
            handleSubmit,
            formState: { errors },
            // reset,
        } = useForm<UserFormData>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                email: "",
                password: "",
            },
        }
    );
    const navigate = useNavigate();
    //const location = useLocation();
    
    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/users/log-in', data);
            if (response.status === 200) {
              // Assuming response.data.token and response.data.payload are available
              const token = response.data.token;
              const userData = response.data.payload; 
        
              // Set token in cookie (adjust expiration as needed)
              const expirationDate = new Date();
              expirationDate.setTime(expirationDate.getTime() + (2 * 24 * 60 * 60 * 1000)); // 2 days in milliseconds
              document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/`; 
        
              // Store user data in local storage
              localStorage.setItem('userData', JSON.stringify(userData));
              // Redirect based on user role
             
              if (userData.role === "Admin") {
                navigate("/"); 
              } else {
                navigate("/Product-page"); 
              }
            } else {
              console.error('Login failed:', response.status, response.statusText);
            }
          } catch (error) {
            console.error('Login error:', error);
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
                        {errors.email && (<Form.Control.Feedback type="invalid">{errors.email.message}</Form.Control.Feedback>)}
                        </FloatingLabel>
                    </Form.Group>
                </Col>
                <Col className='w-100'>
                    <Form.Group className="py-1">
                        <FloatingLabel
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
                         {errors.password && (<Form.Control.Feedback type="invalid">{errors.password.message}</Form.Control.Feedback>)}
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