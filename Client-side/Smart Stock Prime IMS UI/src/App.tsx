import { Route, Routes } from "react-router-dom";
import CustomerManagement from "./pages/CustomerManagement.tsx";
import UserManagement from "./pages/UserManagement.tsx";

function App() {
   return (
    <>
        <Routes>
            <Route path='/user-page' element={<UserManagement/>}/>
            <Route path='/customer-page' element={<CustomerManagement/>}/>
            {/* <Route path='/product' element={<DashboardLayout><ProductPage/></DashboardLayout>} /> */}
        </Routes>
    </>  
   );
}

export default App;

// import ReactSideBar from "@/components/ReactSideBar";
// import {Toaster} from "@/components/ui/toaster";

// const DashboardLayout = ({children}) => {
//     return(
//         <>
//             <div className="h-screen w-screen flex">
//                 <ReactSideBar/>
//                 <div className="w-screen p-1">
//                     <div className="flex-grow m-5">
//                         {children}
//                     </div>
//                     <Toaster />
//                 </div>
//             </div>
//         </>
//     );
// }
// export default DashboardLayout;