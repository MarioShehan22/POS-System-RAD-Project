import { Container } from "react-bootstrap";
import NavBar from "../component/PageBadge/NavBar";
import { useEffect } from "react";

const DashboardLayout = ({ children }:any) => {
    useEffect(()=>{
    
    },[]);
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