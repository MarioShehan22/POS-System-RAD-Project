import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export type User = {
    email: string,
    fullName: string,
    role: string
}

type ProtectedRouteProps = {
    allowedRoles: string[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { currentUser, authToken } = useAuth();
    const location = useLocation();

    if (!authToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (currentUser === undefined) {
        return <div>Loading...</div>;
    }

    if (currentUser && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/Order-page" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;