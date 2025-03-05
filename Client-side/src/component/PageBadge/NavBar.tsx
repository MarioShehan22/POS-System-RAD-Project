import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavBar.css"
import { useAuth } from "../../confige/AuthProvider";

const NavBar = () => {
    const { authToken, handleLogout, currentUser } = useAuth();

    return (
        <Navbar bg="dark" data-bs-theme="dark" sticky="top">
            <Container className="w-100 d-flex justify-content-between align-items-center">
                <Link to="/" className="text-decoration-none text-body my-element">Smart Stock Prime</Link>

                <Nav className="nav-center-width d-flex justify-content-between align-items-center">
                    {authToken && (
                        <>
                            {currentUser?.role === 'Admin' ? (
                                <>
                                    <Link to="/" className="text-decoration-none text-body my-element">Home</Link>
                                    <Link to="/user-page" className="text-decoration-none text-body my-element">User</Link>
                                    <Link to="/customer-page" className="text-decoration-none text-body my-element">Customer</Link>
                                    <Link to="/product-page" className="text-decoration-none text-body my-element">Product</Link>
                                    <Link to="/Order-page" className="text-decoration-none text-body my-element">Place Order</Link>
                                    <Link to="/Order-Details-page" className="text-decoration-none text-body my-element">Order Details</Link>
                                </>
                            ):(
                                <>
                                <Link to="/customer-page" className="text-decoration-none text-body my-element">Customer</Link>
                                <Link to="/product-page" className="text-decoration-none text-body my-element">Product</Link>
                                <Link to="/Order-page" className="text-decoration-none text-body my-element">Place Order</Link>
                                <Link to="/Order-Details-page" className="text-decoration-none text-body my-element">Order Details</Link>
                            </>
                            )}
                            {/* {(currentUser?.role === 'Admin' || currentUser?.role === 'Staff') && (
                                <>
                                    <Link to="/customer-page" className="text-decoration-none text-body my-element">Customer</Link>
                                    <Link to="/product-page" className="text-decoration-none text-body my-element">Product</Link>
                                    <Link to="/Order-page" className="text-decoration-none text-body my-element">Place Order</Link>
                                    <Link to="/Order-Details-page" className="text-decoration-none text-body my-element">Order Details</Link>
                                </>
                            )} */}
                        </>
                    )}
                </Nav>

                <Nav className="d-flex align-items-center">
                    {authToken ? (
                        <Link to="/login" onClick={handleLogout} className="text-decoration-none text-body my-element">
                            Logout
                        </Link>
                    ) : (
                        <Link to="/login" className="text-decoration-none text-body my-element">
                            Login
                        </Link>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavBar;