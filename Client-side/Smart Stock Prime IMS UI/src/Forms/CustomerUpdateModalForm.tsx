import React, { useEffect, useState } from 'react'
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import { Customers } from '../pages/CustomerManagement';
import axios from "axios";
import { z } from 'zod';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
    data: Customers;
    show: boolean;
    onHide: ()=>void;
};
const CustomerUpdateModalForm = ({ data, show, onHide }:Props) => {
    const {
            control, 
            handleSubmit,
            formState: { errors },
            reset,
        } = useForm<CustomerFormData>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                email: data.email,
                firstName: data.firstName,
                lastName:data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                activeState: data.activeState,
            }
        });
        
    const onSubmit = handleSubmit( async (formData) => {
        await axios.put(`http://localhost:3000/api/v1/customers/update/${data._id}`, formData);
        reset();
        onHide();
    });
  return (
    <Modal show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
    <form onSubmit={onSubmit}>
        <Modal.Title id="contained-modal-title-vcenter" className="p-3">
            Update User Details
        </Modal.Title>
        <Modal.Body>
            <Row>
                <Col>
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
            </Row>
            <Row>
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
            </Row>
            <Row>
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
            </Row>
            <Row>
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

export default CustomerUpdateModalForm