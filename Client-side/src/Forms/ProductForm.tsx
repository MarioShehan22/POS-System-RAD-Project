import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Button, Col, FloatingLabel, Form, Row, Stack} from "react-bootstrap";
import { motion } from 'framer-motion';

const formSchema = z.object({
    productName: z.string().min(1, "product Name is required"),
    quantity: z.number().min(1, "quantity is required"),
    description: z.string().min(1, "description is required"),
    sellingPrice: z.number().min(1, "selling Price is required"),
    showPrice: z.number().min(1, "show Price is required"),
    buyPrice: z.number().min(1, "buy Price Price is required"),
    expDate: z.string().date(),
    activeState: z.boolean(),
});
export type ProductFormData = z.infer<typeof formSchema>;
type Props = {
    onSave: (userProfileData: ProductFormData) => void;
    title?: string;
    buttonText?: string;
};
const ProductForm = ({ onSave, title, buttonText }: Props) => {
    const {
        control, 
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProductFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
            quantity: 0,
            description:"",
            sellingPrice: 0,
            showPrice: 0,
            expDate:"",
            activeState: false,
        },
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        onSave(data); // Call the onSave callback with form data
        reset();
    });
    
    return(
        <Stack direction="horizontal" gap={3} className="border">
            <form
                onSubmit={onSubmit}
                className="w-100 p-2 rounded opacity-75 shadow"
            >
                <Row>
                    <Col>
                        {title && <h2>{title}</h2>}
                        <Form.Group className="py-2">
                            <FloatingLabel controlId="productName" label="Product Name" className="mb-3">
                                <Controller
                                    control={control}
                                    name="productName"
                                    render={({ field }) => (
                                        <Form.Control {...field} type="text" placeholder="Product Name" />
                                    )}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        {errors.productName && <span className="text-danger">{errors.productName.message}</span>}
                    </Col>
                    <Col>
                        <Form.Group className="py-2">
                            <FloatingLabel controlId="quantity" label="Quantity" className="mb-3">
                                <Controller
                                    control={control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <Form.Control
                                            {...field}
                                            type="number"
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            placeholder="Enter quantity"
                                        />
                                    )}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        {errors.quantity && <span className="text-danger">{errors.quantity.message}</span>}
                    </Col>
                    <Col>
                        <Form.Group className="py-2">
                            <FloatingLabel controlId="description" label="Description" className="mb-3">
                                <Controller
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <Form.Control {...field} type="text" placeholder="Enter description" />
                                    )}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        {errors.description && <span className="text-danger">{errors.description.message}</span>}
                    </Col>
                    <Col>
                        <Form.Group className="py-2">
                            <FloatingLabel controlId="buyPrice" label="Buy Price" className="mb-3">
                                <Controller
                                    control={control}
                                    name="buyPrice"
                                    render={({ field }) => (
                                        <Form.Control
                                            {...field}
                                            type="number"
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            placeholder="Enter Buy Price"
                                        />
                                    )}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        {errors.buyPrice && <span className="text-danger">{errors.buyPrice.message}</span>}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="py-2">
                            <FloatingLabel controlId="sellingPrice" label="Selling Price" className="mb-3">
                                <Controller
                                    control={control}
                                    name="sellingPrice"
                                    render={({ field }) => (
                                        <Form.Control
                                            {...field}
                                            type="number"
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            placeholder="Enter Selling Price"
                                        />
                                    )}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        {errors.sellingPrice && <span className="text-danger">{errors.sellingPrice.message}</span>}
                    </Col>
                    <Col>
                        <Form.Group className="py-2">
                            <FloatingLabel controlId="showPrice" label="Show Price" className="mb-3">
                                <Controller
                                    control={control}
                                    name="showPrice"
                                    render={({ field }) => (
                                        <Form.Control
                                            {...field}
                                            type="number"
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            placeholder="Enter Show Price"
                                        />
                                    )}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        {errors.showPrice && <span className="text-danger">{errors.showPrice.message}</span>}
                    </Col>
                    <Col>
                        <Form.Group className="py-2">
                            <FloatingLabel controlId="expDate" label="Exp Date" className="mb-3">
                                <Controller
                                    control={control}
                                    name="expDate"
                                    render={({ field }) => (
                                        <Form.Control {...field} type="date" placeholder="Enter date" />
                                    )}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        {errors.expDate && <span className="text-danger">{errors.expDate.message}</span>}
                    </Col>
                    <Col className="d-flex align-items-center">
                        <Button variant="dark" type="submit" className="w-100">
                            {buttonText || "Add Product"}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="py-2 d-flex">
                            <Controller
                                control={control}
                                name="activeState"
                                render={({ field: { value, ...field } }) => (
                                    <Form.Check
                                        className="ms-2"
                                        {...field}
                                        checked={value}
                                        type="checkbox"
                                        label="Active"
                                    />
                                )}
                            />
                        </Form.Group>
                        {errors.activeState && <span className="text-danger">{errors.activeState.message}</span>}
                    </Col>
                </Row>
        </form>
    </Stack>
    );
};

export default ProductForm;