import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: string | null;
    login: (token: string, role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Check if token is valid and not expired
                const payload = parseJwt(token);
                const expiration = payload.exp * 1000; // Convert to milliseconds

                if (Date.now() < expiration) {
                    // Valid token, extract role
                    setIsAuthenticated(true);

                    // Find role claim
                    const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                    const role = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim;

                    setUserRole(role || 'User');
                } else {
                    // Token expired, remove it
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const parseJwt = (token: string) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Failed to parse token:', e);
            throw e;
        }
    };

    const login = (token: string, role: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setUserRole(role);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
        window.location.reload(); // Reload to reset state
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};