'use client';
import React, {createContext, useState, useEffect, ReactNode} from 'react';
import { getAccessToken,setAccessToken } from '@/Auth/AuthService';
import {jwtDecode} from "jwt-decode";
interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    authenticate: (token: string) => void;
    signout: () => void;
    token: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const token = getAccessToken();
        setIsAuthenticated(!!token);
    }, []);

    const authenticate = (token: string) => {
        setAccessToken(token);
        try {
            const decodedToken: any = jwtDecode(token);
            setToken(token);
            setIsAuthenticated(true);
        } catch (error) {
            setToken(null);
            setIsAuthenticated(false);
        }
    };


    const signout = () => {
        setAccessToken('');
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, authenticate, signout, token }}>
            {children}
        </AuthContext.Provider>
    );


};