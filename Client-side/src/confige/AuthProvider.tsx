import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { User } from "./ProtectedRoute";

type AuthContextType = {
    authToken: string | null;
    currentUser: User | null | undefined;
    handleLogin: (token: string, user: User) => void;
    handleLogout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    authToken: null,
    currentUser: undefined,
    handleLogin: () => {},
    handleLogout: () => {},
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);

    useEffect(() => {
        // Get token from cookies
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        const token = tokenCookie ? tokenCookie.split('=')[1] : null;

        // Get user data from localStorage
        const storedUser = localStorage.getItem('userData');

        if (token && storedUser) {
            try {
                setAuthToken(token);
                setCurrentUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user data:', error);
                setCurrentUser(null);
            }
        } else {
            setCurrentUser(null);
        }
    }, []);

    const handleLogin = (token: string, user: User) => {
        // Set token in cookie (with httpOnly flag if possible)
        document.cookie = `token=${token}; path=/; max-age=86400`; // 24 hours

        // Set user data in localStorage
        localStorage.setItem('userData', JSON.stringify(user));

        // Update state
        setAuthToken(token);
        setCurrentUser(user);
    };

    const handleLogout = () => {
        // Remove token cookie
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        // Remove user data from localStorage
        localStorage.removeItem('userData');

        // Clear state
        setAuthToken(null);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, currentUser, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used inside of a AuthProvider');
    }
    return context;
}