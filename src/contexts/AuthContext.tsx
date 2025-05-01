import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType } from '../types';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const storedToken = localStorage.getItem('authToken');
    // const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const response = await apiLogin(username, password);
    
    if (response.token) {
      setToken(response.token);
      setIsAuthenticated(true);
      
      // Store token and expiry in localStorage
      localStorage.setItem('authToken', response.token);
      
      return true;
    }
    return false;
  };

  const logout = (): void => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}