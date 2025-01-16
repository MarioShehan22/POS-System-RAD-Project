import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavBar.css"

const NavBar = () => {
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" sticky="top" className="border border-white">
                <Container className="w-100 d-flex justify-content-between align-items-center">
                    <Navbar.Brand href="#home">Smart Stock Prime</Navbar.Brand>

                    <Nav className="nav-center-width d-flex justify-content-between align-items-center">
                        {/* <Link to="/">Home</Link> */}
                        <Link to="/" className="text-decoration-none text-body my-element">Home</Link>
                        <Link to="/user-page" className="text-decoration-none text-body my-element">User</Link>
                        <Link to="/customer-page" className="text-decoration-none text-body my-element">Customer</Link>
                        <Link to="/product-page" className="text-decoration-none text-body my-element">Product</Link>
                        <Link to="/Order-page" className="text-decoration-none text-body my-element">Place Order</Link>
                        <Link to="/Order-Details-page" className="text-decoration-none text-body my-element">Order Detils</Link>
                    </Nav>
                    <Nav className="d-flex justify-content-between align-items-center">
                        <Link to="/login" className="text-decoration-none text-body my-element">LogIn</Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
};

export default NavBar;