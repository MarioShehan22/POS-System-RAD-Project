import { Container } from "react-bootstrap";
import NavBar from "../component/PageBadge/NavBar";

const DashboardLayout = ({ children }:any) => {
    return (
        <>
            <div className="dashboard-container">
                <NavBar/>
                <Container>
                    <div className="content-container">
                        {children}
                    </div>
                </Container>
            </div>
        </>
    );
};

export default DashboardLayout;