import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface AuthContextType {
    isAuthenticated: boolean;
    userRole: string | null;
    userId: string | null;
    login: (token: string, role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = parseJwt(token);
                const expiration = payload.exp * 1000;

                if (Date.now() < expiration) {
                    setIsAuthenticated(true);

                    const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                    const role = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim;

                    setUserRole(role || null);
                    setUserId(payload.sub || null);
                } else {
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
            if (!base64Url) return {};

            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Failed to parse token:', e);
            return {};
        }
    };

    const login = (token: string, role: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setUserRole(role);
        try {
            const payload = parseJwt(token);
            setUserId(payload.sub || null);
        } catch (e) {
            console.error('Failed to parse token during login:', e);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, userId, login, logout }}>
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