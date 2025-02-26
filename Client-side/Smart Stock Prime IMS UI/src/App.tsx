import { Route, Routes } from "react-router-dom";
import CustomerManagement from "./pages/CustomerManagement.tsx";
import UserManagement from "./pages/UserManagement.tsx";
import DashboardLayout from "./layout/DashboardLayout.tsx";
import ProductManagement from "./pages/ProductManagement.tsx";
import  HomePage from "./pages/HomePage.tsx";
import Ordermanagement from "./pages/Ordermanagement.tsx";
import OrderDetailsManagement from "./pages/OrderDetailsManagement.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProtectedRoute from "./confige/ProtectedRoute.tsx";

function App() {
   return (
    <>
        <Routes>
            <Route path='/login' element={<LoginPage/>}/>
            {/* <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                
            </Route> */}
            <Route path="/" element={<DashboardLayout><HomePage /></DashboardLayout>} />
            <Route path="/user-page" element={<DashboardLayout><UserManagement /></DashboardLayout>} />
            <Route path='/customer-page' element={<DashboardLayout><CustomerManagement/></DashboardLayout>}/>
            <Route path='/product-page' element={<DashboardLayout><ProductManagement/></DashboardLayout>}/>
            <Route path='/Order-page' element={<DashboardLayout><Ordermanagement/></DashboardLayout>}/>
            <Route path='/Order-Details-page' element={<DashboardLayout><OrderDetailsManagement/></DashboardLayout>}/>
        </Routes>
    </>  
   );
}

export default App;
