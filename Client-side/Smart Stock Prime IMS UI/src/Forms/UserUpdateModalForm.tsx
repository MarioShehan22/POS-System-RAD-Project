import React from 'react'
import { UpdateUser } from '../pages/UserManagement';
import {  z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import axios from "axios";
import { Controller, useForm } from 'react-hook-form';

const formSchema = z.object({
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    fullName: z.string().min(1, "Full name is required"),
    activeState: z.boolean(),
    password: z.string().min(8, "Password is required"),
    role: z.string().min(2, "Role is required"),
});
export type UserFormData = z.infer<typeof formSchema>;

type Props = {
    data:UpdateUser;
    show: boolean;
    onHide: ()=>void;
};
export const UserUpdateModalForm = ({ data, show, onHide }:Props) => {
    const {
        control, // Use control instead of register for improved type safety
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UserFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: data.email,
            fullName: data.fullName,
            activeState: data.activeState,
            password: data.password,
            role: data.role,
        },
    });

    const onSubmit = handleSubmit( async (formData) => {
        await axios.put(`http://localhost:3000/api/v1/users/update/${data._id}`, formData);
        reset();
        onHide();
    });
  return (
        <Modal show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <form onSubmit={onSubmit}>
            <Modal.Title id="contained-modal-title-vcenter" className="p-3">
                Update Customer Details
            </Modal.Title>
            <Modal.Body>
                <Row>
                    <Col>
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
                </Row>
                <Row>
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
                </Row>
                <Row>
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
                <Row>
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
            </Modal.Body>
            <Modal.Footer>
                    <Button onClick={onHide}>Close</Button>
                    <Button type="submit">Submit</Button>
            </Modal.Footer>
        </form>
    </Modal>
  )
}