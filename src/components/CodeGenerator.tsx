import React, { useState, useEffect } from 'react';
import { User, ApiResponse } from '../types';
import { generateAccessCode } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ResultDisplay from './ResultDisplay';

const CodeGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { logout, tokenProd, tokenSandbox } = useAuth();
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('production');

  // Add token expiration check
  useEffect(() => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry, 10);
      const timeToExpiry = expiryTime - Date.now();
      
      // If token is about to expire in the next 10 minutes
      if (timeToExpiry < 600000 && timeToExpiry > 0) {  
        alert('Your session will expire soon. Please complete your work and login again.');
      }
      
      // If token has expired
      if (expiryTime <= Date.now()) {
        alert('Your session has expired. Please login again.');
        logout();
      }
    }
  }, [logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const isSandbox = environment === 'sandbox'
    const token = environment === 'sandbox' ? tokenSandbox : tokenProd
    
    if (!token) {
      alert('Authentication error. Please login again.');
      logout();
      return;
    }
    
    const user: User = {
      name: name.trim(),
      email: email.trim(),
    };
    
    setIsLoading(true);
    const response = await generateAccessCode(user, token, isSandbox);
    
    // Handle 401 error specially
    if (!response.success && response.error?.includes('Authentication expired')) {
      alert('Your session has expired. Please login again.');
      logout();
      return;
    }
    
    setResult(response);
    setIsLoading(false);
  };

  const handleEnvironmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnvironment(event.target.value as 'sandbox' | 'production');
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setResult(null);
  };

  return (
    <div className="container">
      <header>
        <h1>Access Code Generator</h1>
        <button onClick={logout} className="btn btn-small">Logout</button>
      </header>
      
      <main>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="client-name">Client Name:</label>
            <input 
              type="text" 
              id="client-name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="client-email">Client Email:</label>
            <input 
              type="email" 
              id="client-email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>
          
          <div className="button-group">
            <button 
              type="submit" 
              className="btn primary-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Requesting...' : 'Request Code'}
            </button>
            <button 
              type="button" 
              onClick={handleReset} 
              className="btn"
              disabled={isLoading}
            >
              Reset
            </button>

            <label>
              <input
                type="radio"
                name="environment"
                value="production"
                checked={environment === 'production'}
                onChange={handleEnvironmentChange}
                disabled={isLoading}
              />
              Production
            </label>
            <label>
              <input
                type="radio"
                name="environment"
                value="sandbox"
                checked={environment === 'sandbox'}
                onChange={handleEnvironmentChange}
                disabled={isLoading}
              />
              Sandbox
            </label>
          </div>
        </form>
        
        <ResultDisplay result={result} />
      </main>
    </div>
  );
};

export default CodeGenerator;