import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Button, Col, Form, Row, Stack} from "react-bootstrap";
import { motion } from 'framer-motion';

const formSchema = z.object({
    productName: z.string().min(1, "product Name is required"),
    quantity: z.number().min(1, "quantity is required"),
    description: z.string().min(1, "description is required"),
    sellingPrice: z.number().min(1, "selling Price is required"),
    showPrice: z.number().min(1, "show Price is required"),
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
                        <Form.Label>Product Name</Form.Label>
                        <Controller
                            control={control}
                            name="productName"
                            render={({field}) => (
                                <Form.Control  {...field} type="text" placeholder="Product Name"/>
                            )}
                        />
                    </Form.Group>
                    {errors.productName && <span className="text-danger">{errors.productName.message}</span>}
                </Col>
                <Col>
                    <Form.Group className="py-2">
                        <Form.Label>First Name</Form.Label>
                        <Controller
                            control={control}
                            name="quantity"
                            render={({field}) => (
                                <Form.Control  {...field} type="number" placeholder="Enter quantity"/>
                            )}
                        />
                    </Form.Group>
                    {errors.quantity && <span className="text-danger">{errors.quantity.message}</span>}
                </Col>
                <Col>
                    <Form.Group className="py-2">
                        <Form.Label>Description</Form.Label>
                        <Controller
                            control={control}
                            name="description"
                            render={({field}) => (
                                <Form.Control  {...field} type="text" placeholder="Enter description"/>
                            )}
                        />
                    </Form.Group>
                    {errors.description && <span className="text-danger">{errors.description.message}</span>}
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
                        <Form.Label>Selling Price</Form.Label>
                        <Controller
                            control={control}
                            name="sellingPrice"
                            render={({field}) => (
                                <Form.Control  {...field} type="number" placeholder="Enter sellingPrice"/>
                            )}
                        />
                    </Form.Group>
                    {errors.sellingPrice && <span className="text-danger">{errors.sellingPrice.message}</span>}
                </Col>
                <Col>
                    <Form.Group className="py-2">
                        <Form.Label>Show Price</Form.Label>
                        <Controller
                            control={control}
                            name="showPrice"
                            render={({field}) => (
                                <Form.Control  {...field} type="number" placeholder="Enter showPrice"/>
                            )}
                        />
                    </Form.Group>
                    {errors.showPrice && <span className="text-danger">{errors.showPrice.message}</span>}
                </Col>
                <Col>
                    <Form.Group className="py-2">
                        <Form.Label>Exp Date</Form.Label>
                        <Controller
                            control={control}
                            name="expDate"
                            render={({field}) => (
                                <Form.Control  {...field} type="date" placeholder="Enter date"/>
                            )}
                        />
                    </Form.Group>
                    {errors.expDate && <span className="text-danger">{errors.expDate.message}</span>}
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

export default ProductForm;