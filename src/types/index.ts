export interface User {
    name: string;
    email: string;
  }
  
  export interface ApiResponse {
    success: boolean;
    code?: string;
    error?: string;
  }
  
  export interface AuthResponse {
    token?: string;
    error?: string;
  }
  
  export interface AuthContextType {
    isAuthenticated: boolean;
    isSandbox: boolean;
    login: (username: string, password: string, isSandbox: boolean) => Promise<boolean>;
    logout: () => void;
    token: string | null;
  }