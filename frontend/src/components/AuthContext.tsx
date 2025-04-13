import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    login: (token: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }:{children:any}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');
        setIsAuthenticated(!!token);
    }, []);

    const login = (token: string) => {
        sessionStorage.setItem('accessToken', token);
        setIsAuthenticated(true);
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, login}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

