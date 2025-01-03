import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Button, Col, Form, Row, Stack} from "react-bootstrap";
import { motion } from 'framer-motion';

const formSchema = z.object({
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    firstName: z.string().min(1, "FirstName name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    address: z.string().min(1, "Address is required"),
    phoneNumber: z.string().min(1, "phoneNumber is required"),
    activeState: z.boolean(),
});
export type CustomerFormData = z.infer<typeof formSchema>;
type Props = {
    onSave: (userProfileData: CustomerFormData) => void;
    title?: string;
    buttonText?: string;
};
const CustomerForm = ({ onSave, title, buttonText }: Props) => {
    const {
        control, 
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CustomerFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName:"",
            address: "",
            phoneNumber: "",
            activeState: false,
        },
    });

    const onSubmit = handleSubmit((data) => {
        onSave(data); // Call the onSave callback with form data
        reset();
    });

    return(
        <Stack direction="horizontal" gap={3}>
        <motion.form onSubmit={onSubmit} className="w-100"
                     initial={{ x: -100, y: -100, opacity: 0 }}
                     animate={{ x: 0, y: 0, opacity: 1 }}
                     transition={{ type: "spring", delay: 0.2, duration: 1 }}
        >
            <Row>
                <Col>
                    {title && <h2>{title}</h2>}
                    <Form.Group className="py-2">
                        <Form.Label>Email</Form.Label>
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
                        <Form.Label>First Name</Form.Label>
                        <Controller
                            control={control}
                            name="firstName"
                            render={({field}) => (
                                <Form.Control  {...field} type="text" placeholder="Enter First Name"/>
                            )}
                        />
                    </Form.Group>
                    {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
                </Col>
                <Col>
                    <Form.Group className="py-2">
                        <Form.Label>Last Name</Form.Label>
                        <Controller
                            control={control}
                            name="lastName"
                            render={({field}) => (
                                <Form.Control  {...field} type="text" placeholder="Enter Last Name"/>
                            )}
                        />
                    </Form.Group>
                    {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
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
                        <Form.Label>Address</Form.Label>
                        <Controller
                            control={control}
                            name="address"
                            render={({field}) => (
                                <Form.Control  {...field} type="text" placeholder="Enter address"/>
                            )}
                        />
                    </Form.Group>
                    {errors.address && <span className="text-danger">{errors.address.message}</span>}
                </Col>
                <Col>
                    <Form.Group className="py-2">
                        <Form.Label>Phone Number</Form.Label>
                        <Controller
                            control={control}
                            name="phoneNumber"
                            render={({field}) => (
                                <Form.Control  {...field} type="text" placeholder="Enter phoneNumber"/>
                            )}
                        />
                    </Form.Group>
                    {errors.phoneNumber && <span className="text-danger">{errors.phoneNumber.message}</span>}
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
            </Row>
        </motion.form>
    </Stack>
    );
};

export default CustomerForm;