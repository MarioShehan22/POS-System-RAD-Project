import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { AxiosError } from "axios";
import { toast } from 'react-toastify';
import { Products } from '../pages/ProductManagement';
import AxiosInstance from '../confige/AxiosInstance';

interface ProductFormData {
    productName: string;
    quantity: number;
    description: string;
    sellingPrice: number;
    showPrice: number;
    buyPrice: number;
    expDate: string;
    activeState: boolean;
}

const ProductUpdateModalForm: React.FC<{
    data: Products;
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}> = ({ data, show, onHide, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ProductFormData>({
        productName: data.productName,
        quantity: data.quantity,
        description: data.description,
        sellingPrice: data.sellingPrice,
        showPrice: data.showPrice,
        buyPrice: data.buyPrice,
        expDate: formatDateForInput(data.expDate),
        activeState: data.activeState
    });
    const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

    // Date formatting utility
    function formatDateForInput(dateString: string): string {
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error('Date formatting error:', error);
            return new Date().toISOString().split('T')[0];
        }
    }

    // Reset form when data changes
    useEffect(() => {
        setFormData({
            productName: data.productName,
            quantity: data.quantity,
            description: data.description,
            sellingPrice: data.sellingPrice,
            showPrice: data.showPrice,
            buyPrice: data.buyPrice,
            expDate: formatDateForInput(data.expDate),
            activeState: data.activeState
        });
    }, [data]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : 
                    type === 'number' ? Number(value) : value
        }));
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

        if (!formData.productName) {
            newErrors.productName = "Product name is required";
        } else if (formData.productName.length > 100) {
            newErrors.productName = "Product name must be less than 100 characters";
        }

        if (!formData.expDate) {
            newErrors.expDate = "Expiration date is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            
            await AxiosInstance.put(`/products/update/${data._id}`, formData);
            
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
    };

    // Handle modal close
    const handleClose = () => {
        // Reset form and close modal
        setFormData({
            productName: data.productName,
            quantity: data.quantity,
            description: data.description,
            sellingPrice: data.sellingPrice,
            showPrice: data.showPrice,
            buyPrice: data.buyPrice,
            expDate: formatDateForInput(data.expDate),
            activeState: data.activeState
        });
        setErrors({});
        onHide();
    };

    return (
        <Modal 
            show={show} 
            onHide={handleClose}
            size="lg" 
            centered
            backdrop="static"
        >
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Product Details</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <Row>
                        <Col>
                            <Form.Group className="py-2">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleInputChange}
                                    placeholder="Enter Product Name"
                                />
                                {errors.productName && (
                                    <span className="text-danger">
                                        {errors.productName}
                                    </span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="py-2">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="Enter Quantity"
                                />
                                {errors.quantity && (
                                    <span className="text-danger">
                                        {errors.quantity}
                                    </span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="py-2">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter description"
                                />
                                {errors.description && (
                                    <span className="text-danger">
                                        {errors.description}
                                    </span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="py-2">
                                <Form.Label>Selling Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="sellingPrice"
                                    value={formData.sellingPrice}
                                    onChange={handleInputChange}
                                    placeholder="Enter selling price"
                                />
                                {errors.sellingPrice && (
                                    <span className="text-danger">
                                        {errors.sellingPrice}
                                    </span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="py-2">
                                <Form.Label>Show Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="showPrice"
                                    value={formData.showPrice}
                                    onChange={handleInputChange}
                                    placeholder="Enter show price"
                                />
                                {errors.showPrice && (
                                    <span className="text-danger">
                                        {errors.showPrice}
                                    </span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="py-2">
                                <Form.Label>Buy Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="buyPrice"
                                    value={formData.buyPrice}
                                    onChange={handleInputChange}
                                    placeholder="Enter buy price"
                                />
                                {errors.buyPrice && (
                                    <span className="text-danger">
                                        {errors.buyPrice}
                                    </span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="py-2">
                                <Form.Label>Expiration Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="expDate"
                                    value={formData.expDate}
                                    onChange={handleInputChange}
                                />
                                {errors.expDate && (
                                    <span className="text-danger">
                                        {errors.expDate}
                                    </span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="py-2">
                                <Form.Label>Active State</Form.Label>
                                <Form.Check 
                                    type="checkbox"
                                    name="activeState"
                                    checked={formData.activeState}
                                    onChange={handleInputChange}
                                    label="Active"
                                />
                                {errors.activeState && (
                                    <span className="text-danger">
                                        {errors.activeState}
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