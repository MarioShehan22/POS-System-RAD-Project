import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import axios, { AxiosError } from "axios";
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Products } from '../pages/ProductManagement';

// Zod schema with better validation
const formSchema = z.object({
    productName: z.string()
        .min(1, "Product name is required")
        .max(100, "Product name must be less than 100 characters"),
    quantity: z.number()
        .min(0, "Quantity cannot be negative")
        .max(999999, "Quantity is too large"),
    description: z.string()
        .min(1, "Description is required")
        .max(500, "Description must be less than 500 characters"),
    sellingPrice: z.number()
        .min(0, "Selling price cannot be negative")
        .max(999999999, "Price is too large"),
    showPrice: z.number()
        .min(0, "Show price cannot be negative")
        .max(999999999, "Price is too large"),
    buyPrice: z.number()
        .min(0, "Buy price cannot be negative")
        .max(999999999, "Price is too large"),
    expDate: z.string().min(1, "Expiration date is required"),
    activeState: z.boolean(),
});

type ProductFormData = z.infer<typeof formSchema>;

interface Props {
    data: Products;
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

const ProductUpdateModalForm: React.FC<Props> = ({ 
    data, 
    show, 
    onHide,
    onSuccess 
}) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const formatDateForInput = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error('Date formatting error:', error);
            return new Date().toISOString().split('T')[0]; // Fallback to current date
        }
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProductFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: data.productName,
            quantity: data.quantity,
            description: data.description,
            sellingPrice: data.sellingPrice,
            showPrice: data.showPrice,
            buyPrice: data.buyPrice,
            expDate: formatDateForInput(data.expDate),
            activeState: data.activeState,
        },
    });

    const handleClose = () => {
        reset();
        onHide();
    };

    const onSubmit = handleSubmit(async (formData) => {
        try {
            setIsSubmitting(true);
            await axios.put(
                `http://localhost:3000/api/v1/products/update/${data._id}`, 
                formData
            );
            toast.success('Product updated successfully');
            onSuccess?.();
            handleClose();
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMessage = axiosError.response?.data?.message || 'Failed to update product';
            toast.error(errorMessage);
            console.error('Update error:', error);
        } finally {
            setIsSubmitting(false);
        }
    });

    const renderFormField = (
        name: keyof ProductFormData,
        label: string,
        type: string,
        placeholder: string
    ) => (
        <Row>
            <Col>
                <Form.Group className="py-2">
                    <Form.Label>{label}</Form.Label>
                    <Controller
                        control={control}
                        name={name}
                        render={({ field }) => (
                            <Form.Control
                                {...field}
                                type={type}
                                placeholder={placeholder}
                                disabled={isSubmitting}
                            />
                        )}
                    />
                    {errors[name] && (
                        <span className="text-danger">
                            {errors[name]?.message}
                        </span>
                    )}
                </Form.Group>
            </Col>
        </Row>
    );

    return (
        <Modal 
            show={show} 
            onHide={handleClose}
            size="lg" 
            centered
            backdrop="static"
        >
            <form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Product Details</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {renderFormField("productName", "Product Name", "text", "Enter product name")}
                    {renderFormField("quantity", "Quantity", "number", "Enter quantity")}
                    {renderFormField("description", "Description", "text", "Enter description")}
                    {renderFormField("sellingPrice", "Selling Price", "number", "Enter selling price")}
                    {renderFormField("showPrice", "Show Price", "number", "Enter show price")}
                    {renderFormField("buyPrice", "Buy Price", "number", "Enter buy price")}
                    {renderFormField("expDate", "Expiration Date", "date", "")}
                    
                    <Row>
                        <Col>
                            <Form.Group className="py-2">
                                <Form.Label>Active State</Form.Label>
                                <Controller
                                    control={control}
                                    name="activeState"
                                    render={({ field }) => (
                                        <Form.Check 
                                            {...field}
                                            type="checkbox"
                                            checked={field.value}
                                            label="Active"
                                            disabled={isSubmitting}
                                        />
                                    )}
                                />
                                {errors.activeState && (
                                    <span className="text-danger">
                                        {errors.activeState.message}
                                    </span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Updating...
                            </>
                        ) : (
                            'Update Product'
                        )}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default ProductUpdateModalForm;