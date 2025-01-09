import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">Logo</Navbar.Brand>
                    <Nav className="me-auto">
                        {/* <Link to="/">Home</Link> */}
                        <Nav.Link href="#home"><Link to="/user-page">User</Link></Nav.Link>
                        <Nav.Link href="#home"><Link to="/customer-page">Customer</Link></Nav.Link>
                        <Nav.Link href="#home"><Link to="/product-page">Product</Link></Nav.Link>
                        
                        {/* <Nav.Link href="#home"><Link to="/customer-page">Customer</Link></Nav.Link> */}
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
};

export default NavBar;