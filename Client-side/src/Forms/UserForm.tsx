import {z} from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Button, Col, Form, Row, Stack, Toast, ToastContainer} from "react-bootstrap";
import { motion } from 'framer-motion';

const formSchema = z.object({
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    fullName: z.string().min(1, "Full name is required"),
    activeState: z.boolean(),
    password: z.string().min(8, "Password is required"),
    role: z.string().min(2, "Role is required"),
});
export type UserFormData = z.infer<typeof formSchema>;

type Props = {
    onSave: (userProfileData: UserFormData) => void;
    title?: string;
    buttonText?: string;
};

const UserForm = ({ onSave, title, buttonText }: Props) => {
    const {
        control, // Use control instead of register for improved type safety
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UserFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            fullName: "",
            activeState: false,
            password: "",
            role: "Staff",
        },
    });


    const onSubmit = handleSubmit((data) => {
        console.log(data);
        onSave(data); // Call the onSave callback with form data
        reset();
    });

    return (
        <Stack direction="horizontal" gap={3}>
            <Form onSubmit={onSubmit} className="w-100">
                <Row>
                    <Col>
                        {title && <h2>{title}</h2>}
                        <Form.Group className="py-2">
                            <Form.Label>Email address</Form.Label>
                            <Controller
                                control={control}
                                name="email"
                                render={({field}) => (
                                    <Form.Control  {...field} type="email" placeholder="name@example.com"/>
                                )}
                            />
                        </Form.Group>
                        {errors.email && <span className="text-danger">{errors.email.message}</span>}
                    </Col>
                    <Col>
                        <Form.Group className="py-2">
                            <Form.Label>Role</Form.Label>
                            <Controller
                                control={control}
                                name="role"
                                render={({field}) => (
                                    <Form.Control  {...field} type="text" placeholder="Enter Role"/>
                                )}
                            />
                        </Form.Group>
                        {errors.role && <span className="text-danger">{errors.role.message}</span>}
                    </Col>
                    <Col>
                        <Form.Group className="py-2">
                            <Form.Label>Active State</Form.Label>
                            <Controller
                                control={control}
                                name="activeState"
                                render={({ field }) => (
                                    <Form.Check {...field} type="checkbox" value={undefined} label="Active" defaultChecked />
                                )}
                            />
                        </Form.Group>
                        {errors.activeState && <span className="text-danger">{errors.activeState.message}</span>}
                    </Col>
                    <Col className="d-flex align-items-center">
                        <Button variant="dark" type="submit" className="w-100">
                            {buttonText || "Submit"}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="py-2">
                            <Form.Label>Password</Form.Label>
                            <Controller
                                control={control}
                                name="password"
                                render={({field}) => (
                                    <Form.Control  {...field} type="text" placeholder="Enter password"/>
                                )}
                            />
                        </Form.Group>
                        {errors.password && <span className="text-danger">{errors.password.message}</span>}
                    </Col>
                    <Col>
                        <Form.Group className="py-2">
                            <Form.Label>Full Name</Form.Label>
                            <Controller
                                control={control}
                                name="fullName"
                                render={({field}) => (
                                    <Form.Control  {...field} type="text" placeholder="Enter full name"/>
                                )}
                            />
                        </Form.Group>
                        {errors.fullName && <span className="text-danger">{errors.fullName.message}</span>}
                    </Col>
                </Row>
            </Form>
            {/* <ToastContainer className="position-static">
                    <Toast>
                        <Toast.Header>
                            <strong className="me-auto">Bootstrap</strong>
                            <small className="text-muted">just now</small>
                        </Toast.Header>
                        <Toast.Body>See? Just like this.</Toast.Body>
                    </Toast>
            </ToastContainer> */}
        </Stack>  
    );
};

export default UserForm;