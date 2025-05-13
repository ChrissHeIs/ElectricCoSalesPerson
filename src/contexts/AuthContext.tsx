import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType } from '../types';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [tokenProd, setTokenProd] = useState<string | null>(null);
  const [tokenSandbox, setTokenSandbox] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const storedTokenProd = localStorage.getItem('authToken_Prod');
    const storedTokenSandbox = localStorage.getItem('authToken_Sandbox');
    // const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (storedTokenProd && storedTokenProd) {
        setTokenProd(storedTokenProd);
        setTokenSandbox(storedTokenSandbox);
        setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const responseSandbox = await apiLogin(username, password, true);
    const responseProd = await apiLogin(username, password, false);
    
    if (responseSandbox.token && responseProd.token) {
      setTokenProd(responseProd.token);
      setTokenSandbox(responseSandbox.token);
      setIsAuthenticated(true);
      
      // Store token and expiry in localStorage
      localStorage.setItem('authToken_Sandbox', responseSandbox.token);
      localStorage.setItem('authToken_Prod', responseProd.token);
      
      return true;
    }
    return false;
  };

  const logout = (): void => {
    setTokenProd(null);
    setTokenSandbox(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken_Sandbox');
    localStorage.removeItem('authToken_Prod')
    localStorage.removeItem('tokenExpiry');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, tokenProd, tokenSandbox }}>
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