import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

interface User {
    id: number;
    name: string;
    email: string;
    mobile: string;
}

interface AuthContextType {
    user: User | null;
    login: (accessToken: string, userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    // Attempt to refresh token to see if session is still valid
                    await api.post('/auth/refresh');
                    // Since our refresh endpoint doesn't return user info right now, 
                    // we might need a /me endpoint in the future.
                    // For now, let's assume if refresh works, token is fine.
                    // To actually get user data, we'd need to fetch it or store it in localStorage.
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                } catch (error) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = (accessToken: string, userData: User) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
