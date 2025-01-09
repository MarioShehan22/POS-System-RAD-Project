import { Route, Routes } from "react-router-dom";
import CustomerManagement from "./pages/CustomerManagement.tsx";
import UserManagement from "./pages/UserManagement.tsx";
import DashboardLayout from "./layout/DashboardLayout.tsx";
import ProductManagement from "./pages/ProductManagement.tsx";

function App() {
   return (
    <>
        <Routes>
            <Route path='/user-page' element={<DashboardLayout><UserManagement/></DashboardLayout>}/>
            <Route path='/customer-page' element={<DashboardLayout><CustomerManagement/></DashboardLayout>}/>
            <Route path='/product-page' element={<DashboardLayout><ProductManagement/></DashboardLayout>}/>
            {/* <Route path='/product' element={} /> */}
            {/* ProductManagement */}
        </Routes>
    </>  
   );
}

export default App;
