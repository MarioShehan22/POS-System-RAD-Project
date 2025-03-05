import axios from 'axios';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import AxiosInstance from '../confige/AxiosInstance';

const FrequentlyCustomers = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
      
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === Math.max(0, products.length - 3) ? 0 : prevIndex + 1
        );
    };
      
    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? Math.max(0, products.length - 3) : prevIndex - 1
        );
    };
      
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 4000);
        return () => clearInterval(timer);
    }, [products.length]);

    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            const response = await AxiosInstance.get("/orders/frequent-customers");
            console.log(response.data);
            setProducts(response.data);
            setError("");
          } catch (error) {
            setError('Failed to fetch Customers');
            console.error('Error fetching Customers:', error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
      }, []);
      if (isLoading) {
        return (
          <Card className="p-4 text-center">
            <Spinner animation="border" variant="primary" className="me-2" />
            <span className="text-muted">Loading Customers...</span>
          </Card>
        );
      }
    
      if (error) {
        return (
          <Alert variant="danger" className="d-flex align-items-center">
            <AlertCircle className="me-2" />
            <span>{error}</span>
          </Alert>
        );
      }
    
      if (!products.length) {
        return (
          <Card className="p-4 text-center">
            <Card.Text className="text-muted">No Frequently Coming Customers</Card.Text>
          </Card>
        );
      }
  return (
    <Container fluid className="p-4">
    <Card>
      <Card.Body>
        <Card.Title className="h4 mb-4">Frequently Coming Customers</Card.Title>
        
        <div className="position-relative overflow-hidden">
          <div 
            style={{
              display: 'flex',
              transition: 'transform 0.3s ease-in-out',
              transform: `translateX(-${currentIndex * (100 / 3)}%)`
            }}
          >
            {products?.map((item, index) => (
              <div 
                key={index}
                style={{ flex: '0 0 33.333%', padding: '0 15px' }}
              >
                <Card className="h-100" style={{ borderBottom: '4px solid rgb(0, 60, 255)' }}>
                  <Card.Body>
                    <Card.Title className="h5 mb-4">{item?.customerInfo?.email}</Card.Title>
                    
                    <Row className="mb-2">
                      <Col xs={6} className="text-muted">Total Customer Sales:</Col>
                      <Col xs={6} className="text-end fw-bold">{(item?.totalCustomerSales).toFixed(2)}</Col>
                    </Row>
                    
                    <Row className="mb-2">
                      <Col xs={6} className="text-muted">Order Count:</Col>
                      <Col xs={6} className="text-end fw-bold">{item?.orderCount}</Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
          
          <div className="d-flex justify-content-center gap-2 mt-4">
            <Button 
              variant="outline-secondary" 
              className="rounded-circle p-2" 
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft />
            </Button>
            <Button 
              variant="outline-secondary" 
              className="rounded-circle p-2" 
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  </Container>
  )
}
export default FrequentlyCustomers;