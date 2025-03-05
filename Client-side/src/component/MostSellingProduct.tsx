import { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, AlertCircle} from 'lucide-react';
import axios from "axios";
import AxiosInstance from '../confige/AxiosInstance';

interface MostSellingProduct{
  productId:string;
  productName:string;
  quantitySold:number;
}

const MostSellingProduct = () => {
    const [products, setProducts] = useState<MostSellingProduct[]>({
      productId:"",
      productName:"",
      quantitySold:0
    });
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
          const response = await AxiosInstance.get("/orders/top-selling");
          setProducts(response.data);
          setError("");
        } catch (error) {
          setError('Failed to fetch expiring products');
          console.error('Error fetching products:', error);
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
          <span className="text-muted">Loading products...</span>
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
          <Card.Text className="text-muted">No Most Selling products</Card.Text>
        </Card>
      );
    }
  return (
    <Container fluid className="p-4">
    <Card>
      <Card.Body>
        <Card.Title className="h4 mb-4">Most Selling Products</Card.Title>
        
        <div className="position-relative overflow-hidden">
          <div 
            style={{
              display: 'flex',
              transition: 'transform 0.3s ease-in-out',
              transform: `translateX(-${currentIndex * (100 / 3)}%)`
            }}
          >
            {products.map((item, index) => (
              <div 
                key={index}
                style={{ flex: '0 0 33.333%', padding: '0 15px' }}
              >
                <Card className="h-100" style={{ borderTop: '4px solid rgb(0, 60, 255)' }}>
                  <Card.Body>
                    <Card.Title className="h5 mb-4">{item.productName}</Card.Title>
                    
                    <Row className="mb-2">
                      <Col xs={6} className="text-muted">ID:</Col>
                      <Col xs={6} className="text-end fw-bold">{item.productId}</Col>
                    </Row>
                    
                    <Row className="mb-2">
                      <Col xs={6} className="text-muted">Quantity:</Col>
                      <Col xs={6} className="text-end fw-bold">{item.quantitySold}</Col>
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

export default MostSellingProduct;